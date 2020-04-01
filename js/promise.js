function Promise(executor) {
  this.status = 'pending';
  this.onResolveCallback = [];
  this.onRejectCallback = [];

  const resolve =(value)=> {
    setTimeout(()=> {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.data = value;
        this.onResolveCallback.forEach((fn)=> {
          if (typeof fn === 'function') {
            fn(value);
          }
        });
      }
    })
  }
  
  const reject =(reason) => {
    setTimeout(()=> {
      if (this.status === 'pending') {
        this.status = 'rejected'
        this.data = reason;
        this.onRejectCallback.forEach((fn)=> {
          if (typeof fn === 'function') {
            fn(reason);
          }
        })
      }
   })
  }

  try {
    if (typeof executor === 'function') {
      executor(resolve, reject)
    }
  } catch(e) {
    reject(e);
  }
  
}

Promise.prototype.then = function (onResolve, onReject) {
  const resolveFn = typeof onResolve === 'function' ? onResolve : (v) => v;
  const rejectFn = typeof onReject === 'function' ? onReject : (e) => { throw e };
  
  if (this.status === 'fulfilled') {
    return new Promise((resolve, reject) => {
      setTimeout(()=> {
        try {
          const x = resolveFn(this.data);
          if (x instanceof Promise) {
            return x.then(resolve, reject)
          }
          resolve(x)
        } catch(e) {
          reject(e)
        }
      })
    })
  }

  if (this.status === 'rejected') {
    return new Promise((resolve, reject)=> {
      setTimeout(()=> {
        try {
          const x = rejectFn(this.data);
          if (x instanceof Promise) {
            return x.then(resolve, reject)
          }
          resolve(x)
        } catch(e) {
          reject(e)
        }
      })
    })
  }

  if (this.status === 'pending') {
    return new Promise((resolve, reject)=> {
      this.onResolveCallback.push(()=> {
        try {
          const x = resolveFn(this.data);
          if (x instanceof Promise) {
            return x.then(resolve, reject)
          }
          resolve(x)
        } catch(e) {
          reject(e)
        }
      })

      this.onRejectCallback.push(()=> {
        try {
          const x = rejectFn(this.data);
          if (x instanceof Promise) {
            return x.then(resolve, reject)
          }
          resolve(x)
        } catch(e) {
          reject(e)
        }
      })
    })
  }
}

Promise.prototype.catch = function (onReject) {
  return this.then(null, onReject)
}

Promise.resolve = function(onResolve) {
  return this.then(onResolve, null)
}

Promise.reject = function() {
  
}

Promise.all = function() {
  
}

Promise.race = function() {
  
}

var aa = new Promise((resolve, reject)=> {
  var name = '1123';
  setTimeout(()=> {
    resolve(name)
  }, 1000)
}).then((res)=> {
  console.log(res)
  throw new Error('test')
}).then().catch((err)=> {
  console.log(err)
})