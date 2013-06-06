define ->
  class Fish
    
    x : 0
    y : 0
    w : 8
    h : 6
    
    rotation  : 0
    
    framedelay    : 0
    FRAMEDELAYMOD : 2
    frame : 0
    LASTFRAME : 7
    
    SPRITE : null
    SPRITENAME : null
    GFX :
      'fledgeling0' :
        W : 28
        H : 17
      'fledgeling1' :
        W : 54
        H : 34
      'fish00' :
        W : 46
        H : 31
      'fish01' :
        W : 116
        H : 77
      'fish10' :
        W : 46
        H : 31
      'fish11' :
        W : 116
        H : 77
      'fish20' :
        W : 50
        H : 34
      'fish21' :
        W : 125
        H : 86
    
    FISHCHANCE :
      'fledgeling0' : 2
      'fledgeling1' : 2
      'fish00'      : 1
      'fish10'      : 1
      #'fish01'      : 2
      #'fish11'      : 1
      'fish20'      : 4
      #'fish21'      : 1
    
    # Fish have a lifetime...
    # if they don't eat often enough they die
    # larger fish need to eat more often
    
    # lifetime : 0
    
    # Defined in constructor
    speed           : null 
    dSpeed          : $$.r(0.31)+0.27
    maxSpeed        : $$.r(10)+2
    fatnessPenalty  : 0.987
    energyBoost     : 1.0013
    
    # Have we been hooked or bagged?
    caught        : false
    
    # Are we part of the player's posse?
    player        : false
    
    # Hashable? Do we want to put this in the list of things to hittest?
    hashable      : true
  
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
      @game.addFish()
      
    collectRoe : (n) ->
      atom.playSound('roe')
      @game.player.roe+=n
    
    hooked : (e) ->
      @catcher = e
      @caught  = true
    
    eat : (e) ->
      if @player
        @game.player.fat += $$.r(0.25)
      @dSpeed   *= @fatnessPenalty
      @maxSpeed *= @energyBoost
    
    draw : ->
      ac = atom.context
      ac.save()
      ac.translate(@x, @y)
      ac.rotate(@rotation) unless @rotation is 0
      
      properties = @GFX[@SPRITENAME]
      ac.drawImage(@SPRITE, 0, @frame*properties.H, properties.W, properties.H, -properties.W+(properties.W>>1), -properties.H>>1, properties.W, properties.H)
      
      if !@caught
        if @framedelay % @FRAMEDELAYMOD is 0
          @framedelay = @FRAMEDELAYMOD+1
          @frame++
          if @frame > @LASTFRAME
            @frame = 0
        else
          @framedelay++
        
      ac.restore()
    
    checkHits : ->
      # todo: make this hit test function a common one.
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
      @r2 = @GFX[@SPRITENAME].H
      @r2 *= @r2
    
    remove : ->
      if @player
        @game.loseFish()
      @move = null
      @catcher = null
      @game = null
    
    constructor : (params) ->
      @[k] = v for k, v of params
      
      if !@speed?
        @speed =
          x : 0
          y : 0
          normalizationFactor : $$.r(0.27)+0.51
      
      if @player
        @game.addFish()
    
      @dSpeed   = $$.r(0.12)+0.13 unless @dSpeed?
      @maxSpeed = $$.r(8)+4       unless @maxSpeed?
      
      @frame = $$.R(0,@LASTFRAME)
      @SPRITENAME = $$.WR(@FISHCHANCE)
      @SPRITE = atom.gfx[@SPRITENAME]

      @updateHitRadius()
