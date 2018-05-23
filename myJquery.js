function $(selector) {
    function myJquery(selector) {
        if (typeof selector == "string") {
            if (selector.charAt(0) == "<") {
                var tag = selector.slice(1, -1);
                this[0] = document.createElement(tag);
                this.length = 1;
            } else {
                var alls = document.querySelectorAll(selector);
                this.length = alls.length;
                for (var i = 0; i < alls.length; i++) {
                    this[i] = alls[i];
                }
            }
        } else if (typeof selector == "object" && selector.nodeType == 1) {
            this[0] = selector;
            this.length = 1
        } else if (typeof selector == "function") {
            this.ready(selector)
        } else if (!selector) {
            return this;
        }
    }

    myJquery.prototype = {
        before: function (tag) {
            var tag=tag.slice(1,-1);
            var ele=document.createElement(tag);
            var arr=[];
            this.each(function (index,obj) {
                console.log(obj.parentNode)
                var newobj= {ele:obj,parent:obj.parentNode}
                arr.push(newobj);
            })
            for(var i=0;i<arr.length;i++){
                var clone=ele.cloneNode(true);
                arr[i].parent.insertBefore(clone,arr[i].ele)
            }

            return this;


        },
        after: function () {

        },
        replace: function () {

        },
        clone: function (opt) {
            var opt = opt === true ? true : false;
            var arr = [];
            this.each(function (index, obj) {
                arr.push(obj.cloneNode(opt));
            })
            this._clear();
            this._extend(arr);
            return this;
        },
        append: function (tag) {
            var tag = tag.slice(1, -1);
            var ele = document.createElement(tag);
            this.each(function (index, obj) {
                var clone = ele.cloneNode(true);
                obj.appendChild(clone);
            })
            return this;
        },
        appendTo: function (selector) {
            var alls = document.querySelectorAll(selector);
            for (var i = 0; i < alls.length; i++) {
                var ele = this[0].cloneNode(true);
                this[i] = ele;
                alls[i].appendChild(ele);
            }
            this.length = alls.length;
            return this;
        },
        each: function (callback) {
            for (var i = 0; i < this.length; i++) {
                callback(i, this[i]);
            }
        },
        ready: function (callback) {
            window.onload = function () {
                callback()
            }
        },
        html: function (val) {
            this.each(function (index, obj) {
                obj.innerHTML = val;
            })
            return this;
        },
        text: function (val) {
            this.each(function (index, obj) {
                obj.innerText = val;
            })
            return this;
        },
        css: function (attr, val) {
            this.each(function (index, obj) {
                if (typeof attr == "string") {
                    if (attr == "width" || attr == "height" || attr == "padding" || attr == "margin" || attr == "font-size") {

                        obj.style[attr] = parseInt(val) + "px";
                    } else {
                        obj.style[attr] = val
                    }
                } else if (typeof  attr == "object") {
                    for (var i in attr) {
                        if (i == "width" || i == "height" || i == "padding" || i == "margin" || i == "font-size") {
                            obj.style[i] = parseInt(attr[i]) + "px";
                        } else {
                            obj.style[i] = attr[i]
                        }
                    }
                }
            })
            return this;
        },
        attr: function () {
            var arg = arguments;
            if (arguments.length == 1 && typeof arguments[0] == "string") {
                return this[this.length - 1].getAttribute(arguments[0])
            } else if (arguments.length == 1 && typeof arguments[0] == "object") {
                this.each(function (index, obj) {
                    for (var i in arg[0]) {
                        obj.setAttribute(i, arg[0][i])
                    }
                })
            } else if (arguments.length == 2 && arguments[1] != "del") {
                this.each(function (index, obj) {
                    obj.setAttribute(arg[0], arg[1]);
                })
            } else if (arguments.length == 2 && arguments[1] == "del" && typeof arguments[0] == "string") {
                this.each(function (index, obj) {
                    obj.removeAttribute(arg[0])
                })
            } else if (arguments.length == 2 && arguments[1] == "del" && typeof arguments[0] == "object") {
                this.each(function (index, obj) {
                    for (var i in arg[0]) {
                        if (arg[0] instanceof Array) {
                            obj.removeAttribute(arg[0][i]);
                        } else {
                            obj.removeAttribute(i);
                        }
                    }
                })
            }
        },

        click: function (callback) {
            this.each(function (index, obj) {
                obj.onclick = function () {
                    callback.call(obj)
                }
            })
            return this;
        },

        childs: function (num) {
            var that = this;
            var arr = [];
            this.each(function (index, obj) {
                arr = arr.concat(that._getChilds(obj, num))
            })

            this._clear();
            this._extend(arr);
            return this;

        },
        parent: function () {
            var arr = [];
            this.each(function (index, obj) {
                var flag = true;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == obj.parentNode) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    arr.push(obj.parentNode)
                }
            })
            this._clear();
            this._extend(arr);
            return this;

        },
        next: function () {
            var arr = [];
            var that = this;
            this.each(function (index, obj) {
                arr.push(that._next(obj))
            })
            this._clear();
            this._extend(arr);
            return this;
        },
        nexts: function () {
            var arr = [];
            var that = this;
            this.each(function (index, obj) {
                arr = arr.concat(that._nexts(obj))
            })
            this._clear();
            this._extend(arr);
            return this;
        },
        pre: function () {
            var arr = [];
            var that = this;
            this.each(function (index, obj) {
                arr.push(that._pre(obj))
            })
            this._clear();
            this._extend(arr);
            return this;

        },
        pres: function () {
            var arr = [];
            var that = this;
            this.each(function (index, obj) {
                arr = arr.concat(that._pres(obj))
            })
            this._clear();
            this._extend(arr);
            return this;
        },
        siblings: function () {
            var arr = this._siblings(this[0]);
            this._clear();
            this._extend(arr);
            return this;
        },
        _getChilds: function (parent, num) {
            var childs = parent.childNodes;
            var arr = [];
            for (var i = 0; i < childs.length; i++) {
                if (childs[i].nodeType == 1) {
                    arr.push(childs[i]);
                }
            }
            if (num) {
                return arr[num];
            }
            return arr;

        },
        _clear: function () {
            for (var i = 0; i < this.length; i++) {
                delete  this[i];
            }
        },
        _extend: function (obj) {
            for (var i = 0; i < obj.length; i++) {
                this[i] = obj[i]
            }
            this.length = obj.length;
        },
        _next: function (obj) {
            var next = obj.nextSibling;
            if (!next) {
                return null;
            }
            while (next.nodeType != 1) {
                next = next.nextSibling
                if (!next) {
                    return null;
                }
            }
            return next;

        },
        _nexts: function (obj) {
            var arr = [];
            var next = obj.nextSibling;
            if (!next) {
                return arr;
            }

            while (next) {
                if (next.nodeType == 1) {
                    arr.push(next);
                }
                next = next.nextSibling;
            }
            return arr;

        },
        _pre: function (obj) {
            var up = obj.previousSibling;
            if (!up) {
                return null;
            }
            while (up.nodeType != 1) {
                up = up.previousSibling
                if (!up) {
                    return null;
                }
            }
            return up;
        },
        _pres: function (obj) {
            var arr = [];
            var next = obj.previousSibling;
            if (!next) {
                return arr;
            }
            while (next) {
                if (next.nodeType == 1) {
                    arr.push(next);
                }
                next = next.previousSibling;
            }
            return arr;
        },
        _siblings: function (obj) {
            return this._nexts(obj).concat(this._pres(obj))
        }

    }

    return new myJquery(selector);
}
