define ->
  class AIFish
    
    x : 0
    y : 0
    w : 8
    h : 6
    
    rotation  : 0
    
    # Defined in constructor
    lastPosition  : null
    speed         : null 
    dSpeed        : $$.r(0.21)+0.13
    maxSpeed      : $$.r(10)+2
    
    COLOR :
      HEX :
        # colors are unique to ability
        pink    : '#ED3776'
        purple  : '#B349AB'
        blue    : '#4527F2'
        cyan    : '#27C6F2'
        teal    : '#27F2B5'
        green   : '#27F24C'
        leaf    : '#97F227'
        grass   : '#D7F227'
        orange  : '#F2A427'
        
      DISTRIB :
        pink    : 1
        purple  : 2
        blue    : 4
        cyan    : 6
        teal    : 5
        green   : 3
        leaf    : 2
        grass   : 2
        orange  : 1
        
    color : null
    
    gradient : [
      [0.2, '#6D59B3']
      [0.8, '#484063']
    ]
  
    chase :
      w_2   : 64 # half the width of the actual box
      h_2   : 64
    
    target : atom.input.mouse
  
    normalizeSpeed : ->
      if (Math.abs(@x - @target.x) < @chase.w_2) and (Math.abs(@y - @target.y) < @chase.h_2)
        # Major deceleration for close proximity to target
        @speed.x *= @speed.normalizationFactor*0.71 unless Math.abs(@speed.x) < @maxSpeed * 0.4
        @speed.y *= @speed.normalizationFactor*0.71 unless Math.abs(@speed.y) < @maxSpeed * 0.4
      else
        # Normal speed normalization
        @speed.x *= @speed.normalizationFactor unless Math.abs(@speed.x) < @maxSpeed
        @speed.y *= @speed.normalizationFactor unless Math.abs(@speed.y) < @maxSpeed
        
  
    setRotation : ->
      newRotation = Math.atan(@speed.y/@speed.x)
        
      if @speed.x < 0
        newRotation += Math.PI
     
      @rotation = newRotation
      
    move : ->
      @x += @speed.x
      @y += @speed.y
    
      @x += @game.current
      
      if @x > @target.x
        @speed.x -= @dSpeed
      else
        @speed.x += @dSpeed
      
      if @y > @target.y
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
      
      if false
        g = ac.createLinearGradient(-@w*0.2,0,@w*0.8,0)
        (
          g.addColorStop(i[0], i[1])
          i[0] -= 0.0313
          if i[0] < 0
            i[0] = 1
        ) for i in @gradient
      else
        g = @color
      
      ac.fillStyle = g
      
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
      
    
      @dSpeed   = $$.r(0.12)+0.13 unless params.dSpeed?
      @maxSpeed = $$.r(8)+4       unless params.maxSpeed?
      
      @lastPosition =
        x : @x
        y : @y

      @color = @COLOR.HEX[$$.WR(@COLOR.DISTRIB)] unless params.color?

