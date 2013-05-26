define ->
  class AIFish
    
    x : 0
    y : 0
    w : 64
    h : 32
    
    rotation  : 0
    speed     :
      x : 0
      y : 0
      normalizationFactor : $$.r(0.3)+0.3
    dSpeed    : $$.r(0.12)+0.13
    maxSpeed  : $$.r(8)+2
  
    normalizeSpeed : ->
      @speed.x *= @speed.normalizationFactor unless Math.abs(@speed.x) < @maxSpeed
      @speed.y *= @speed.normalizationFactor unless Math.abs(@speed.y) < @maxSpeed
  
    chaseMouse : ->
      @x += @speed.x
      @y += @speed.y
    
      if @x > atom.input.mouse.x
        @speed.x -= @dSpeed
      else
        @speed.x += @dSpeed
      
      if @y > atom.input.mouse.y
        @speed.y -= @dSpeed
      else
        @speed.y += @dSpeed
      
      @normalizeSpeed()
      
      
    draw : ->
      ac = atom.context
      ac.save()
      ac.translate(@x, @y)
      
      ac.fillStyle = '#8a9'
      ac.beginPath()
      
      # higher ratio means more exaggeration
      ac.moveTo(-(@w*0.2),-(@h>>1))
      ac.lineTo(-(@w*0.2), (@h>>1))
      ac.lineTo( (@w*0.8), 0)
      ac.moveTo(-(@w*0.2), (@h>>1))
      ac.lineTo( (@w*0.8), 0)
      ac.closePath()
      ac.stroke()
      ac.fill()
      
      ac.fillStyle = '#000'
      ac.fillRect(-1,-1,2,2) # pivot point
      
      ac.restore()
      
    constructor : (params) ->
      @[k] = v for k, v of params
      
      @speed.normalizationFactor  = $$.r(0.3)+0.3
      @dSpeed                     = $$.r(0.12)+0.13
      @maxSpeed                   = $$.r(8)+2