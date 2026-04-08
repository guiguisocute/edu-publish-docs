# 代码块测试

本页测试 VitePress 核心的代码高亮机制和代码组。

## 基础高亮
```python
def publish_message(message: str):
    """
    发布一条通知
    """
    print(f"[EDU-PUBLISH] {message}")
    return True
```

## 代码分组 (Code Groups)
::: code-group
```npm [npm]
npm run docs:dev
```
```pnpm [pnpm]
pnpm run docs:dev
```
```yarn [yarn]
yarn docs:dev
```
:::

## 代码高亮行
```javascript {1,4}
export default {
  data() {
    return {
      msg: '高亮显示第 1 行和第 4 行！'
    }
  }
}
```
