// 深度搜索优先 DFS
function deepFirstSearch(node) {
  const nodeList = [];
  if (node) {
    const stack = [node]
    do{
      const nodeItem = stack.pop();
      nodeList.push(nodeItem);
      stack.push(...[...nodeItem.children].reverse())
    } while(stack.length)
  }
  return nodeList;
}

// 广度搜索优先 BFS
function breadthFirstSearch(node) {
  const nodeList = [];
  if (node) {
    const queue = [node];
    do {
      const nodeItem = queue.shift();
      nodeList.push(nodeItem);
      queue.push(...[...nodeItem.children])
    } while(queue.length)
  }
  return nodeList;
}
  
const root = document.getElementById('root');
const deepList = deepFirstSearch(root);
const breadthList = breadthFirstSearch(root);
console.log(deepList, breadthList)