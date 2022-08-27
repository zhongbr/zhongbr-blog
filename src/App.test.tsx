/*
 * @Description: desc
 * @Author: 张盼宏
 * @Date: 2022-08-27 15:32:40
 * @LastEditors: 张盼宏
 * @LastEditTime: 2022-08-27 17:30:19
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
