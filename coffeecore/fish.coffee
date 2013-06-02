define ->
  class Fish
    
    x : 0
    y : 0
    w : 8
    h : 6
    
    rotation  : 0
    
    # Fish have a lifetime...
    # if they don't eat often enough they die
    # larger fish need to eat more often
    
    # lifetime : 0
    
    # Defined in constructor
    lastPosition    : null
    speed           : null 
    dSpeed          : $$.r(0.31)+0.27
    maxSpeed        : $$.r(10)+2
    fatnessPenalty  : 0.987
    
    # Have we been hooked or bagged?
    caught        : false
    
    # Are we part of the player's posse?
    player        : false
    
    # Hashable? Do we want to put this in the list of things to hittest?
    hashable      : true
    
    COLOR :
      HEX :
        # colors are unique to ability
        #pink    : '#ED3776'
        #purple  : '#B349AB'
        #blue    : '#4527F2'
        #cyan    : '#27C6F2'
        #teal    : '#27F2B5'
        green   : '#27F24C'
        leaf    : '#97F227'
        #grass   : '#D7F227'
        #orange  : '#F2A427'
        
      DISTRIB :
        #pink    : 1
        #purple  : 2
        #blue    : 4
        #cyan    : 6
        #teal    : 5
        green   : 3
        leaf    : 2
        #grass   : 2
        #orange  : 1
        
    color : null
    
    gradient : [
      [0.2, '#6D59B3']
      [0.8, '#484063']
    ]
  
    chase :
      w_2   : 32 # half the width of the actual box
      h_2   : 32
    
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
      @rotation = Math.atan2(@speed.y, @speed.x)
    
    chaseTarget : ->
      if @x > @target.x
        @speed.x -= @dSpeed
      else
        @speed.x += @dSpeed
      
      if @y > @target.y
        @speed.y -= @dSpeed
      else
        @speed.y += @dSpeed
    
    move : ->
      if @caught
        if @x < 0 or @y < 0
          @remove()
        else
          @x = @catcher.x
          @y = @catcher.y
        
      else
        # todo : make it so something happens if player's fish dips out.. / is too slow to catch up
        # bonus for a spawning stage?
        if @player is false
          @checkHits()
        
        @x += @speed.x
        @y += @speed.y
      
        @x += @game.current
        
        @chaseTarget()
        @normalizeSpeed()
        @setRotation()
    
    recruit : ->
      if @target.constructor.name == 'Swarm'
        @target.children[@target.children.indexOf(@)] = null
    
      # todo : extend this for further uses
      atom.playSound('recruit')
      @target = atom.input.mouse
      @player = true
      
    
    hooked : (e) ->
      @catcher = e
      @caught  = true
    
    eat : (e) ->
      growthFactor = $$.r(e.r>>2)
      @w += growthFactor
      @h += growthFactor
      @updateHitRadius()
      @dSpeed *= @fatnessPenalty
    
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
    
    checkHits : ->
      bin = @game.hash2d.get(@)
      (
        if entity? and @canHit(entity) and @hit(entity) and entity.player
          @recruit()
          break
      ) for entity in bin
      return 
      
    canHit : (e) ->
      switch e.constructor.name
        when 'Fish'
          if @player then false else true
        else
          false
          
    hit : (e) ->
      dx = e.x - @x
      dy = e.y - @y
      
      dx*dx + dy*dy < @r2+e.r2
    
    updateHitRadius : ->
      @r2 = Math.min(@w,@h)
      @r2 *= @r2
    
    remove : ->
      @move = null
      @catcher = null
    
    constructor : (params) ->
      @[k] = v for k, v of params
      
      if !@speed?
        @speed =
          x : 0
          y : 0
          normalizationFactor : $$.r(0.27)+0.51
      
    
      @dSpeed   = $$.r(0.12)+0.13 unless @dSpeed?
      @maxSpeed = $$.r(8)+4       unless @maxSpeed?
      
      @lastPosition =
        x : @x
        y : @y

      @color = @COLOR.HEX[$$.WR(@COLOR.DISTRIB)] unless @color?

      @updateHitRadius()
