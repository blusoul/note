'ui';
auto.waitFor();
function mainLayout() {
  ui.layout(
    <frame>
      <vertical>
        <horizontal bg='#029688'>
          <img
            id='exit_btn'
            w='26'
            h='26'
            marginTop='12'
            marginLeft='8'
            gravity='center_vertical'
            src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABuUlEQVRoQ+2Y70ZEQRiH3+dTiq6la0hdQV8ioqR/UlSrrKJEpGwi0j8pIrqH6FNfo9uoe5gcNtZq352dfefsDGe+z5znOe/7m3NmkMwHmfNLJTDoClYVCK2Ac25CRPZFZA/4CF1nIBVwzh2KyEEL9BjwFSJRusA/8AX3OzCevEAH+IJ7EnhLWkCBPwJa26knj1JaSIE/BoogB4/oAgr8CVAPJm9OjCqgwJ8Cu/3CF/OjCSjwDaBmAR9NQIG/ADat4KMIKPCXwIYlvLmAAn8FrFnDmwoo8NfAagx4MwEF/g5YigVvIqDAPwALMeH7FlDgn4C52PB9CSjwz8BsGfDBAgr8CzBTFnyQgHNuWER+RGSkDfQVmC4TPlRgSES+RWQ0S4ECOusW+nvrWYfYQyL9bdRDIv0PmYfEPbAYc2cyO9AombgBVmJJmAl02Z3S/532aKf0DzQeEukfKT0kzoFtq0yYZqAdSgn2GbBjIRFVoEuw07/Y8min9K8WPSTSv9z1kKgBjZBMRM+AZ7AfgfksBDoEexm4zUagKTElIusi8glshcAHHSlDHxRrXukZsBapBKzfaK/rZV+BX2jTvjGeDAVPAAAAAElFTkSuQmCC'
          />
          <text
            w='*'
            gravity='center'
            lines='2'
            textSize='20sp'
            marginLeft='-30'
            textColor='#f5f5f5'
            text='淘宝快捷操作'
          />
        </horizontal>
        <vertical padding='16'>
          <button
            id='record_btn'
            text='自动报单'
            textSize='16sp'
            h='52'
            marginBottom='10'
            style='Widget.AppCompat.Button.Colored'
          />
          <button
            id='receive_btn'
            text='自动收货'
            textSize='16sp'
            h='52'
            marginBottom='10'
            style='Widget.AppCompat.Button.Colored'
          />
          <button
            id='rate_btn'
            text='自动评价'
            textSize='16sp'
            marginBottom='10'
            h='52'
            style='Widget.AppCompat.Button.Colored'
          />
          <button
            id='draw_coupon_btn'
            text='自动领券'
            textSize='16sp'
            marginBottom='10'
            h='52'
            style='Widget.AppCompat.Button.Colored'
          />
          <button
            id='clear_coupon_btn'
            text='清除券码'
            textSize='16sp'
            marginBottom='10'
            h='52'
            style='Widget.AppCompat.Button.Colored'
          />
          <button
            id='auto_bind_btn'
            text='自动绑卡'
            textSize='16sp'
            marginBottom='10'
            h='52'
            style='Widget.AppCompat.Button.Colored'
          />
        </vertical>
      </vertical>
    </frame>
  );

  // 自动报单
  ui.record_btn.on('click', () => {
    threads.start(function () {
      launchApp('菜鸟裹裹');
      setTimeout(getBtn, 3000);
    });
  });

  // 自动收货
  ui.receive_btn.on('click', () => {
    currentIndex = 0;
    dialogs
      .singleChoice('请选择需要操作的淘宝', ['左边', '右边'], 0)
      .then(function (i) {
        currentIndex = i ? CURRENT_NUM : i;
        dialogs.rawInput('请输入你的支付密码', '').then(function (value) {
          password = value;
          openTB(function () {
            threads.start(function () {
              clickOrder(function () {
                text('待收货').findOne().click();
                setTimeout(receiveFn, 2000);
              });
            });
          });
        });
      });
  });

  // 自动评价
  ui.rate_btn.on('click', () => {
    currentIndex = 0;
    openTB(() => {
      threads.start(function () {
        clickOrder(() => {
          text('待评价').findOne().click();
          setTimeout(rateFn, 2000);
        });
      });
    });
  });

  // 自动领券
  ui.draw_coupon_btn.on('click', () => {
    currentIndex = 0;
    threads.start(function () {
      const list = storage.get('coupon_list');
      if (list) {
        couponList = list;
        draw();
      } else {
        saveCouponList(draw);
      }
    });
  });

  // 清除券码
  ui.clear_coupon_btn.on('click', () => {
    threads.start(function () {
      storage.remove('coupon_list');
      toast('清除成功');
    });
  });

  // 自动绑卡
  ui.auto_bind_btn.on('click', autoBindLayout);

  // 退出
  ui.exit_btn.on('click', () => {
    back();
  });
}

function autoBindLayout() {
  ui.layout(
    <frame>
      <vertical>
        <horizontal bg='#029688'>
          <img
            id='back_tn'
            w='26'
            h='26'
            marginTop='12'
            marginLeft='8'
            gravity='center_vertical'
            src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABuUlEQVRoQ+2Y70ZEQRiH3+dTiq6la0hdQV8ioqR/UlSrrKJEpGwi0j8pIrqH6FNfo9uoe5gcNtZq352dfefsDGe+z5znOe/7m3NmkMwHmfNLJTDoClYVCK2Ac25CRPZFZA/4CF1nIBVwzh2KyEEL9BjwFSJRusA/8AX3OzCevEAH+IJ7EnhLWkCBPwJa26knj1JaSIE/BoogB4/oAgr8CVAPJm9OjCqgwJ8Cu/3CF/OjCSjwDaBmAR9NQIG/ADat4KMIKPCXwIYlvLmAAn8FrFnDmwoo8NfAagx4MwEF/g5YigVvIqDAPwALMeH7FlDgn4C52PB9CSjwz8BsGfDBAgr8CzBTFnyQgHNuWER+RGSkDfQVmC4TPlRgSES+RWQ0S4ECOusW+nvrWYfYQyL9bdRDIv0PmYfEPbAYc2cyO9AombgBVmJJmAl02Z3S/532aKf0DzQeEukfKT0kzoFtq0yYZqAdSgn2GbBjIRFVoEuw07/Y8min9K8WPSTSv9z1kKgBjZBMRM+AZ7AfgfksBDoEexm4zUagKTElIusi8glshcAHHSlDHxRrXukZsBapBKzfaK/rZV+BX2jTvjGeDAVPAAAAAElFTkSuQmCC'
          />
          <text
            w='*'
            gravity='center'
            lines='2'
            textSize='20sp'
            marginLeft='-30'
            textColor='#f5f5f5'
            text='淘宝快捷操作'
          />
        </horizontal>
        <vertical padding='16'>
          <input
            id='card_content'
            inputType='textMultiLine'
            lines='12'
            gravity='top'
            bg='#f2f2f2'
            marginBottom='10'
          />
          <button
            id='auto_bind_btn'
            text='绑猫超卡'
            textSize='16sp'
            marginBottom='10'
            h='52'
            style='Widget.AppCompat.Button.Colored'
          />
        </vertical>
      </vertical>
    </frame>
  );

  ui.card_content.setText(getClip() || '');

  // 返回主界面
  ui.back_tn.on('click', () => {
    ui.card_content.setText('');
    setClip('');
    mainLayout();
  });

  // 绑卡
  ui.auto_bind_btn.on('click', () => {
    const text = '' + ui.card_content.getText();
    if (!text) {
      return toast('请粘贴你的卡密');
    }
    threads.start(function () {
      CARD_LIST = text
        .split('\n')
        .filter((item) => Boolean(item))
        .map((item) => item.split(/[,，+]/));
      app.startActivity({
        action: 'android.intent.action.VIEW',
        data:
          'taobao://pages.tmall.com/wow/chaoshi/act/xtcard?spm=a3204.8884638.0.0#bindCard',
      });

      waitForPackage('com.taobao.taobao');
      setTimeout(autoBind, 2500);
    });
  });
}

mainLayout();

// 淘宝
const CURRENT_NUM = 1;
let CARD_LIST = [];
let ERROR_CARD_LIST = [];
const DAY = 3;
const data = {};
var password = '';
const date = new Date().toLocaleDateString();

let couponList = [];
let currentIndex = 0;
const storage = storages.create('coupon_obj');

// 打开淘宝
function openTB(cb) {
  launchApp('手机淘宝');
  setTimeout(() => {
    try {
      click('手机淘宝', currentIndex);
    } catch (e) {}
    typeof cb === 'function' && setTimeout(cb, 3000);
  }, 2000);
}

// 菜鸟裹裹
function getBtn() {
  const btn = text('查看全部包裹');
  if (btn.exists()) {
    btn.click();
    setTimeout(record, 1000);
  } else {
    scrollDown();
    setTimeout(getBtn, 1000);
  }
}

function compareTime(str) {
  const cur = new Date().getFullYear() + '-' + str;
  return (
    +new Date(cur.replace(/-/g, '/')) <
    new Date(new Date().toISOString().split('T')[0]) - DAY * 86400000 - 1000
  );
}

function writeFile() {
  let str = '';
  Object.keys(data).map((key) => {
    str +=
      key + '  数量：' + data[key].length + '\n' + data[key].join('\n') + '\n';
  });
  const fileName = '/storage/emulated/0/Download/单号-' + date + '.txt';
  files.write(fileName, str, 'GBK');
  setClip(str);
  toast('复制在剪贴板，文件保存在Download中');
  setTimeout(() => {
    back();
    home();
  }, 1000);
}

// 物流评价
function evaluationFn(cb) {
  if (!id('rating').exists()) {
    return typeof cb === 'function' && setTimeout(cb, 800);
  }
  const { right, bottom } = id('rating').findOne().bounds();
  click(right - 15, bottom - 15);
  setTimeout(() => {
    id('poster_flow_choose')
      .findOne()
      .children()
      .forEach((child) => {
        child.click();
      });
    setTimeout(() => {
      id('submit').findOne().click();
      setTimeout(() => {
        id('submit_finish').findOne().click();
        typeof cb === 'function' && setTimeout(cb, 800);
      }, 700);
    }, 700);
  }, 1000);
}

// 物流单号
function record() {
  const list = id('package_info_area').find();
  const len = list.length;
  let i = 0;
  function loop() {
    const item = list[i];
    if (item && i < len) {
      const key = item
        .findOne(id('package_info_item_r2'))
        .text()
        .split('|')[1]
        .trim()
        .replace('【亲友】的', '');
      item.click();
      setTimeout(() => {
        if (!id('mailno_textview').exists()) {
          back();
          i++;
          return setTimeout(loop, 500);
        }
        const date1 = id('feeds_item_date_day_tv').findOne().text();
        const no = id('mailno_textview').findOne().text();
        if (compareTime(date1)) {
          flag = false;
          writeFile();
          return false;
        }
        if (data[key]) {
          if (data[key].indexOf(no) === -1) {
            data[key].push(no);
          }
        } else {
          data[key] = [no];
        }
        evaluationFn(() => {
          back();
          i++;
          setTimeout(loop, 500);
        });
      }, 1500);
    } else {
      scrollDown();
      setTimeout(record, 1000);
    }
  }
  loop();
}

// 确认收货
function receiveFn(psw) {
  var receiveBtn = desc('确认收货').findOne();
  if (!receiveBtn) {
    exit();
    return false;
  }
  receiveBtn.click();
  setTimeout(() => {
    click('输入密码');
    setTimeout(() => {
      password.split('').forEach((item) => click(item));
      setTimeout(() => {
        back();
        setTimeout(receiveFn, 2000);
      }, 4000);
    }, 1000);
  }, 1000);
}

// 评价
function rateFn() {
  if (!desc('评价').exists()) {
    if (currentIndex === CURRENT_NUM) {
      back();
      toast('评价完毕~');
      return setTimeout(home, 1000);
    }
    if (currentIndex === 0) {
      currentIndex = CURRENT_NUM;
      toast('切换淘宝中~');
      setTimeout(home, 1000);
      setTimeout(() => {
        openTB(() => {
          threads.start(function () {
            clickOrder(() => {
              text('待评价').findOne().click();
              setTimeout(rateFn, 2000);
            });
          });
        });
      }, 2000);
    }
    return false;
  }
  const rateBtn = desc('评价').findOne();
  rateBtn.click();
  setTimeout(() => {
    setText('东西非常好，发货速度也快~');
    setTimeout(() => {
      desc('5星').click();
      setTimeout(() => {
        click('发布');
        setTimeout(() => {
          back();
          setTimeout(() => swipe(200, 200, 200, 600, 1), 1000);
          setTimeout(rateFn, 3000);
        }, 1000);
      }, 500);
    }, 500);
  }, 2500);
}

function clickOrder(cb) {
  setScreenMetrics(1080, 2248);
  click(900, 2105, 1043, 2248);
  setTimeout(() => {
    desc('我的订单查看全部订单').click();
    typeof cb === 'function' && setTimeout(cb, 1000);
  }, 1000);
}

// 领券
function drawNext() {
  home();
  setTimeout(draw, 2000);
}

// 领券
function draw() {
  if (!couponList.length) {
    if (currentIndex === CURRENT_NUM) {
      toast('领券完毕~');
      back();
      return setTimeout(home, 1000);
    }
    currentIndex = CURRENT_NUM;
    couponList = storage.get('coupon_list');
    toast('切换淘宝中~');
    return drawNext();
  }
  setClip(couponList[0]);
  couponList.shift();
  setTimeout(() => {
    openTB(() => {
      if (text('打开').exists()) {
        click('打开');
        setTimeout(() => {
          back();
          setTimeout(drawNext, 1000);
        }, 3500);
      } else {
        drawNext();
      }
    });
  }, 1000);
}

function saveCouponList(cb) {
  rawInput('请输入券码', '', (txt) => {
    const list = ('' + txt).match(/(￥[a-zA-Z0-9]+￥)/g);
    if (list) {
      storage.put('coupon_list', list);
      couponList = list;
      typeof cb === 'function' && setTimeout(cb, 1000);
    } else {
      toast('券码有误');
    }
  });
}

// 自动绑卡

function autoBind() {
  const [card, pwd] = CARD_LIST[0];
  setText(0, card);
  setText(1, pwd);
  setTimeout(() => {
    text('确定').findOne().click();
    setTimeout(() => {
      text('确认绑定').findOne().click();
      setTimeout(() => {
        CARD_LIST.shift();
        if (text('此卡已被绑定!').exists()) {
          ERROR_CARD_LIST.push(card + '+' + pwd);
        }
        // 绑完
        if (!CARD_LIST.length) {
          console.log(ERROR_CARD_LIST);
          confirm('所有卡都已绑完，失败' + ERROR_CARD_LIST.length + '个');
          back();
          return setTimeout(home, 1000);
        }

        swipe(500, 1000, 500, 1500, 300);
        setTimeout(autoBind, 2500);
      }, 1500);
    }, 1500);
  }, 700);
}
