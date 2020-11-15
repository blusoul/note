# Vue 笔记

## 组件

### ```$attrs/$listeners```

### provide/inject

### model

```javascript
export default {
  name: 'self-model',
  model: {
    prop: 'value',
    event: 'on-change',
  },
  data() {
    return {}
  },
  methods: {
    onChange(value){
      this.$emit('on-change', value)
    }
  }
}
```

```html
<template>
  <self-model v-model="data"></self-model>
</template>
<script>
export default {
  name: 'Test',
  data() {
    return {
      data: {}
    }
  }
}
</script>
```

### loop v-model

```html
<template>
  <div>
    <self-model
      v-for="(item, index) in data"
      :key="index"
      v-model="data[index]"
    ></self-model>
  </div>
</template>
```

### $event argument

```html
<div></div>
```

### key


### slot/scope-slot


### 自定义指令

