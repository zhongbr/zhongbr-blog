---
tags: ['操作系统']
---
# 新年快乐

```jsx
// dep(antd, https://cdnjs.cloudflare.com/ajax/libs/antd/4.23.0/antd.min.js)
import React, { useState } from 'react';
import { Button } from 'antd';

function App() {
    const [counter, setCounter] = useState(0)
    return <div>
        {counter}
        <Button onClick={() => setCounter(counter => counter + 1)}>click me!</Button>
    </div>
}

export default App;
```
