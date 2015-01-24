var Field = Points.Field;

var dx = [ 0, 1, 1, 1, 0, -1, -1, -1 ];
var dy = [ 1, 1, 0, -1, -1, -1, 0, 1 ];

Renderer.defaults = {
  blueColor: "#4169E1",
  redColor: "#DC143C",
  gridColor: '#DDDDDD',

  margin: 8,
  xSize: 30,
  ySize: 30,
  cellSize: 19,
  pointRadius: 5,

  alpha: 0.6,
  lastMoveMarker: 0,
  lineWidth: 1,
  borderWidth: 2,
  clickHandler: function () {},
  mouseMoveHandler: function () {}
};

function Renderer(canvas, options) {
  if (!canvas) {
    throw new Error('CanvasRenderer: canvas required.');
  }
  this.opt = _.defaults(options || {}, Renderer.defaults);
  this.canvas = canvas;
  this.canvas.width = this.width();
  this.canvas.height = this.height();
  this.ctx = this.canvas.getContext('2d');
  this.proxy = document.createElement('canvas');
  this.proxy.width = this.width();
  this.proxy.height = this.height();
  this.proxyCtx = this.proxy.getContext('2d');
  this.renderGrid();
  var self = this;
  this.mouse = {
    x: 0,
    y: 0
  };
  this.canvas.onclick = function (event) {
    self.opt.clickHandler.call(self, self.mouse.x, self.mouse.y, event);
  };
  this.canvas.onmousemove = function (event) {
    var x = event.pageX - $(self.canvas).offset().left;
    var y = event.pageY - $(self.canvas).offset().top;
    x = Math.round((x - self.opt.margin-1)/self.opt.cellSize);
    y = Math.round((y - self.opt.margin-1)/self.opt.cellSize);
    if (self.mouse.x == x && self.mouse.y == y) {
      return;
    }
    self.mouse = {
      x: x,
      y: y
    };
    self.opt.mouseMoveHandler.call(self, x, y, event);
  };
}

Renderer.prototype.renderField = function (field) {
  var opt = this.opt;
  var self = this;
  var proxyCtx = self.proxyCtx;
  proxyCtx.clearRect(0, 0, self.width(), self.height());
  this.clear();
  Field.each(field, function (x, y) {
    if (!Field.empty(field, x, y)) {
      self.renderPoint({ x: x, y: y, color: Field.color(field, x, y) });
    }
    if (Field.owner(field, x, y)) {
      var owner = Field.owner(field, x, y);
      proxyCtx.save();
      proxyCtx.lineWidth = 0.5;
      proxyCtx.fillStyle = proxyCtx.strokeStyle = (owner == Points.BLUE) ?
        opt.blueColor :
        opt.redColor;
      proxyCtx.beginPath();
      var started = false;
      for (var i=0; i<8; i++) {
        var tx = x + dx[i];
        var ty = y + dy[i];
        if (Field.owner(field, tx, ty) == owner || Field.color(field, tx, ty) == owner) {
          var cx = self.cc(tx);
          var cy = self.cc(ty);
          if (!started) {
            proxyCtx.moveTo(cx, cy);
            started = true;
          } else {
            proxyCtx.lineTo(cx, cy);
          }
        }
      }
      proxyCtx.closePath();
      proxyCtx.fill();
      proxyCtx.stroke();
      proxyCtx.restore();
    }
  });
  var ctx = this.ctx;
  ctx.save();
  ctx.globalAlpha = opt.alpha;
  ctx.drawImage(this.proxy, 0, 0);
  ctx.restore();
};

Renderer.prototype.width = function () {
  var opt = this.opt;
  return (2 * opt.margin + opt.cellSize * (opt.xSize - 1) + 1);
};

Renderer.prototype.height = function () {
  var opt = this.opt;
  return (2 * opt.margin + opt.cellSize * (opt.ySize - 1) + 1);
};

Renderer.prototype.renderGrid = function () {
  var opt = this.opt;
  var ctx = this.ctx;

  ctx.save();
  ctx.strokeStyle = opt.gridColor;
  ctx.lineWidth = opt.lineWidth;

  for (var i=0; i<opt.xSize; i++) {
    var x = opt.margin + i * opt.cellSize + 0.5;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, this.height());
    ctx.stroke();
  }
  for (var i=0; i<opt.ySize; i++) {
    var y = opt.margin + i * opt.cellSize + 0.5;
    ctx.moveTo(0, y);
    ctx.lineTo(this.width(), y);
    ctx.stroke();
  }

  ctx.restore();
  return this;
};

Renderer.prototype.cc = function(x) {
  var opt = this.opt;
  return opt.margin + x * opt.cellSize + 0.5;
};

Renderer.prototype.clear = function() {
  var ctx = this.ctx;
  ctx.clearRect(0, 0, this.width(), this.height());
  this.renderGrid();
  return this;
};

Renderer.prototype.renderPoint = function (pt) {
  var opt = this.opt;
  var ctx = this.ctx;

  ctx.save();
  ctx.lineWidth = 0;
  ctx.fillStyle = pt.color === Points.BLUE ?
    opt.blueColor : opt.redColor;
  ctx.beginPath();
  ctx.arc(this.cc(pt.x), this.cc(pt.y), opt.pointRadius + 0.5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
  return this;
};

Renderer.prototype.renderLastMoveMarker = function (pt, type) {
  var opt = this.opt;
  var ctx = this.ctx;
  ctx.save();
  switch (type || opt.lastMoveMarker) {
    case 1:
      ctx.beginPath();
      ctx.strokeWidth = 0;
      ctx.strokeStyle = (pt.color === Renderer.BLUE) ?
        opt.blueColor :
        opt.redColor;
      ctx.beginPath();
      ctx.arc(this.cc(pt.x), this.cc(pt.y), opt.pointRadius + 2.5, 0, 2 * Math.PI);
      ctx.stroke();
      break;
    default:
      ctx.beginPath();
      ctx.fillStyle = '#FFF';
      ctx.arc(this.cc(pt.x), this.cc(pt.y), Math.floor(opt.pointRadius / 2) + 0.5, 0, 2 * Math.PI);
      ctx.fill();
      break;
  }
  ctx.restore();
  return this;
};

Points.Renderer = Renderer;
