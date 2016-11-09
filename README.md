A simple tool to check responsive web design of different devices on one Page.

# Usage

1. Copy index.html, src/responsive-checker.css, src/responsive-checker.js onto your project;
2. Update the `ResponsiveChecker` instantiation code at the index.html, use your project web page urls;
3. Open the index.html via a browser, recommend Chrome;

For Example: https://zhbhun.github.io/responsive-cheker/

# Advanced
Responsive Checker has predetermined following deives

- iPhone 5
- iPhone 6
- iPhone 6 Plus
- Android Mobile
- iPad
- Android Tablet
- Surface
- MacBook

Whiling instancing ResponsiveChecker, you can offer devices list that you would like to test. Device item could be a string that represent predetermined decive, or a object with name, width and height.

```javascript
new ResponsiveChecker({
  // urls: [...],
  // defaultIndex: 0,
  devices: [
    {
      name: 'MacBook Air',
      width: 1440,
      height: 900,
    }
  ],
});
```


# TODO
- [ ] Synchronize operation in all device. 
- [ ] Emulate touchable interaction without scrollbar. 
- [ ] Beautify.
- [ ] Enhance toolbar.