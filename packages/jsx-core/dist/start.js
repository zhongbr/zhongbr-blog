/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-09-04 16:24:18
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-09-04 18:25:27
 */
import { getAstFromCode, parseModuleStatements, transformJsx } from './index.js';
const code = `
import React, { useEffect, useMemo as useTest } from 'react';
import * as reactEle from 'react';
import { createRoot } from 'react-dom';
import { Button, Modal } from 'antd';

function App() {
    return (
        <div>
            <Button onClick={() => alert('hello')}>hello world</Button>
        </div>
    )
}
export default App`;
const ast = getAstFromCode(code);
const [_code,] = parseModuleStatements(ast);
const js = transformJsx(_code);
console.log(code, js);
