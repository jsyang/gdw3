define ->
  class AIFish
    
    x : 0
    y : 0
    w : 16
    h : 8
    
    rotation  : 0
    
    PI_2  : Math.PI*0.5
    PI2   : Math.PI*2
    
    speed     : null # obj defined in constructor
    dSpeed    : $$.r(0.21)+0.13
    maxSpeed  : $$.r(10)+2
  
    chaseBox :
      w_2 : 128 # half the width of the actual box
      h_2 : 128
  
    normalizeSpeed : ->
      if Math.abs(@x - atom.input.mouse.x) > @chaseBox.w_2 or Math.abs(@y - atom.input.mouse.y) > @chaseBox.h_2
        @speed.x *= @speed.normalizationFactor unless Math.abs(@speed.x) < @maxSpeed
        @speed.y *= @speed.normalizationFactor unless Math.abs(@speed.y) < @maxSpeed
      else
        @speed.x *= @speed.normalizationFactor*0.7 unless Math.abs(@speed.x) < @maxSpeed
        @speed.y *= @speed.normalizationFactor*0.7 unless Math.abs(@speed.y) < @maxSpeed
  
    setRotation : ->
      newRotation = Math.atan(@speed.y/@speed.x)
        
      # 4 quadrants
      if @speed.x < 0
        newRotation += Math.PI
      #ypos = @speed.y > 0 
      
      @rotation = newRotation
      
      # FIXME: coords fucking up
      #if !xpos and ypos
      #  newRotation -= Math.PI
      #else if !xpos and ypos
       # @rotation += Math.PI
      #else if xpos and !ypos
      
      #if Math.abs(newRotation-@rotation) > @PI_2
      #  @rotation = newRotation + @PI_2
      #else
      #  @rotation = newRotation
      #
      ## Make sure we stay within the bounds
      #if Math.abs(@rotation) > @PI2
      #  if @rotation > 0
      #    @rotation -= @PI2
      #  else
      #    @rotation += @PI2
          
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
      @setRotation()
      
      
    draw : ->
      ac = atom.context
      ac.save()
      ac.translate(@x, @y)
      
      ac.rotate(@rotation) unless @rotation is 0
      
      #ac.drawImage(atom.gfx.fish,-@w*0.5,-@h*0.5)
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
      
      
      #ac.fillStyle = '#000'
      #ac.fillRect(-1,-1,2,2) # pivot point
      
      ac.restore()
      
    constructor : (params) ->
      @[k] = v for k, v of params
      
      if !params.speed?
        @speed =
          x : 0
          y : 0
          normalizationFactor : $$.r(0.27)+0.51
        
      @dSpeed                     = $$.r(0.12)+0.13
      @maxSpeed                   = $$.r(8)+2