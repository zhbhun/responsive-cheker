(function (global) {
  'use strict';
  
  // predetermined devices
  const devices = {
    'iPhone 5': {
      name: 'iPhone 5',
      width: 320,
      height: 568,
    }, 
    'iPhone 6': {
      name: 'iPhone 6',
      width: 375,
      height: 667,
    },
    'iPhone 6 Plus': {
      name: 'iPhone 6 Plus',
      width: 414,
      height: 736,
    }, 
    'Android Mobile': {
      name: 'Android Mobile',
      width: 360,
      height: 640,
    },
    'iPad': {
      name: 'iPad',
      width: 768,
      height: 1024,
      rotatable: true,
    },
    'Android Tablet': {
      name: 'Android Tablet',
      width: 800,
      height: 1280,
      rotatable: true,
    },
    'Surface': {
      name: 'Surface',
      width: 1366,
      height: 768,
    },
    'MacBook': {
      name: 'MacBook',
      width: 1440,
      height: 900,
    },
  }; 

  /**
   * Responsive checker constructor
   * 
   * @param {Object} option
   * @param {Array}  option.urls web page urls to checker
   * @param {Number} option.defaultIndex default page index
   * @param {Array}  option.devices devices need to checker, test all if empty
   * @param {Array}  option.padding device horizontal padding, default 15px;
   */
  function ResponsiveChecker (option) {
    this.urls = option.urls;
    this.pageIndex = option.defaultIndex || 0;
    if (!option.devices || option.devices.length === 0) {
      this.devices = [];
      for (let key in devices) {
        this.devices.push(devices[key]);
      }
    } else {
      this.devices = option.devices.map(function (device) {
        if (typeof device === 'string') {
          return devices[device];
        } else if (typeof device === 'object') {
          return device;
        } else {
          throw new Error('Unknow device!');
        }
      });
    }
    this.padding = option.padding || 15;
  }

  // get device render iframe elements
  ResponsiveChecker.prototype._getIframes = function () {
    return document.querySelectorAll('.device iframe');
  };

  // render toolbar
  ResponsiveChecker.prototype._renderToolbar = function () {
    const toolbarElement = document.getElementById('toolbar');
    // render page selector
    const pageSelector = document.createElement('select');
    pageSelector.className = 'page-selector';
    this.urls.forEach(function (url) {
      const optionElement = document.createElement('option');
      optionElement.value = url;
      optionElement.innerText = url;
      pageSelector.appendChild(optionElement);
    });
    pageSelector.value = this.urls[this.pageIndex];
    pageSelector.addEventListener('change', function (e) {
      this.pageIndex = this.urls.indexOf(pageSelector.value);
      const deviceIframeElements = this._getIframes();
      deviceIframeElements.forEach(function (element) {
        element.src = pageSelector.value;
      });
    }.bind(this));
    toolbarElement.appendChild(pageSelector);
  };

  // render device checker
  ResponsiveChecker.prototype._renderDeviceCheckers = function () {
    const currentUrl = this.urls[this.pageIndex];
    const padding = this.padding;
    const checkerElement = document.getElementById('checker');
    this.devices.forEach(function (device) {
      const deviceElement = createDeviceElement(device);
      if (Array.isArray(deviceElement)) {
        deviceElement.forEach(function (element) {
          checkerElement.appendChild(element);
        })
      } else {
        checkerElement.appendChild(deviceElement);
      }
    });

    function createDeviceElement(device) {
      const name = device.name,
        width = device.width,
        height = device.height,
        rotatable = device.rotatable;

      const deviceElement = document.createElement('div');
      deviceElement.className = 'device';
      deviceElement.style.paddingLeft = padding + 'px';
      deviceElement.style.paddingRight = padding + 'px';

      if (!rotatable) {
        deviceElement.appendChild(createHeaderElement(name, width, height));
        deviceElement.appendChild(createIframeElement(width, height));
        return deviceElement;
      }

      const verticalDeviceElement = deviceElement.cloneNode();
      verticalDeviceElement.appendChild(createHeaderElement(name, width, height, 'vertical'));
      verticalDeviceElement.appendChild(createIframeElement(width, height));
      const horizontDeviceElement = deviceElement.cloneNode();
      horizontDeviceElement.appendChild(createHeaderElement(name, width, height, 'horizontal'));
      horizontDeviceElement.appendChild(createIframeElement(height, width));
      return [verticalDeviceElement, horizontDeviceElement];
    }

    function createHeaderElement(name, width, height, direction) {
      const headerElement = document.createElement('h1');
      if (!direction) {
        headerElement.innerText = name + ' - ' + width + '*' + height;
      } else if (direction === 'vertical') {
        headerElement.innerText = name + ' - Vertical - ' + width + '*' + height;
      } else if (direction === 'horizontal') {
        headerElement.innerText = name + ' - Horizontal - ' + height + '*' + width;
      }
      return headerElement;
    }

    function createIframeElement(width, height) {
      const wrapperElement = document.createElement('div');
      wrapperElement.className = 'wrapper';
      const iframeElement = document.createElement('iframe');
      iframeElement.width = width;
      iframeElement.height = height;
      iframeElement.src = currentUrl;
      wrapperElement.appendChild(iframeElement);
      return wrapperElement;
    }
  };

  // render entry
  ResponsiveChecker.prototype._render = function () {
    /*
    + #toolbar
    + #checker
    + -- .device
    + ---- .header
    + ---- .wrapper
    + ------ iframe
    */
    this._renderToolbar();
    this._renderDeviceCheckers();
  }

  // adjust device size
  ResponsiveChecker.prototype._adjustSize = function () {
    // TODO optimize
    const availableHeight = document.body.clientHeight - 75;
    const deviceIframes = document.querySelectorAll('.device iframe');
    deviceIframes.forEach(function (iframe) {
      const width = iframe.clientWidth;
      const height = iframe.clientHeight;
      if (height > availableHeight) {
        const scale = Math.floor((availableHeight / height) * 100) / 100;
        const scaleWidth = width * scale;
        const scaleHeight = availableHeight;
        iframe.style.transform = 'scale(' + scale + ')';
        const wrapper = iframe.parentElement;
        wrapper.style.width = scaleWidth + 'px';
        wrapper.style.height = scaleHeight + 'px';
      }
    });

    // resize app element
    const checkerElement = document.getElementById('checker');
    let totalWidth = 0;
    const deviceElemens = document.querySelectorAll('.device');
    deviceElemens.forEach(function (element) {
      totalWidth += element.clientWidth;
      console.log(element.clientWidth);
    });
    console.log(totalWidth);
    checkerElement.style.width = totalWidth + 2 + 'px';
  }

  // run after contructor
  ResponsiveChecker.prototype.run = function () {
    this._render();
    this._adjustSize();
  };

  global.ResponsiveChecker = ResponsiveChecker;
})(this);