(window.webpackJsonp=window.webpackJsonp||[]).push([[44],{1007:function(t,e,n){t.exports=n.p+"images/coming-soon.jpg"},2354:function(t,e,n){"use strict";n.r(e);var r,o=n(0),c=n.n(o),a=n(18),i=n(15),u=n(69),p=n.n(u),s=n(2),l=n(4),f=n.n(l),m=n(27),h=n(359),y=(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),d=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.state={contentHash:p()()},e}return y(e,t),e.prototype.componentDidMount=function(){this.props.actions.updateHeaderTitle("Reporting")},e.prototype.render=function(){var t=this,e=this.props.classes;return c.a.createElement("div",null,c.a.createElement(m.a,{onChange:function(){t.setState({contentHash:p()()})}},c.a.createElement(f.a,{container:!0,spacing:0},c.a.createElement(f.a,{item:!0,xs:12},c.a.createElement("div",{className:e.page},c.a.createElement(h.a,{classes:e}))))))},e}(o.Component);e.default=Object(a.compose)(Object(s.withStyles)((function(t){return{page:{display:"flex",flexWrap:"wrap",padding:10},imageSize:{height:"calc(100vh - 155px)",width:"calc(100vw - 285px)"}}})),Object(i.b)((function(t){return{profile:t.profile}})))(d)},27:function(t,e,n){"use strict";var r=n(0),o=n(18),c=n(15),a=n(317),i=n(9),u=n.n(i);e.a=Object(o.compose)(Object(c.b)((function(t){return{selectedCompany:u()(t,(function(t){return t.profile.selectedCompany}))}})))((function(t){var e=t.selectedCompany,n=t.onChange,o=t.children;return Object(a.a)((function(){n(e)}),[e]),r.createElement(r.Fragment,null,o)}))},317:function(t,e,n){"use strict";var r=n(30),o=n.n(r),c=n(0);function a(t){var e,n,r=Object(c.useRef)();return e=t,n=r.current,o()(e,n)||(r.current=t),r.current}e.a=function(t,e){Object(c.useEffect)(t,a(e))}},359:function(t,e,n){"use strict";var r,o=n(0),c=n(2),a=n(1007),i=n.n(a),u=(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),p=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return u(e,t),e.prototype.render=function(){var t=this.props.classes;return o.createElement(c.ErrorBoundary,null,o.createElement("div",null,o.createElement("img",{src:i.a,className:t.imageSize,alt:"Coming Soon"})))},e}(o.Component);e.a=Object(c.withStyles)({imageSize:{height:"calc(100vh - 98px)",width:"calc(100vw - 270px)"}})(p)}}]);