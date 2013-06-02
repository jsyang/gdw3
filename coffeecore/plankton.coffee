define ->
  class Plankton
    
    x   : 0
    y   : 0
    PI2 : Math.PI*2
    r   : 4
    
    eaten     : false
    hashable  : true
    
    frame     : 0
    
    SPRITE      : null
    SPRITENAME  : null
    GFX :
      'plankton1' :
        W : 33
        H : 19
      'plankton2' :
        W : 22
        H : 26
      'plankton3' :
        W : 14
        H : 23
      'plankton4' :
        W : 21
        H : 27
      'plankton5' :
        W : 27
        H : 27
      'plankton6' :
        W : 20
        H : 23
      'plankton7' :
        W : 26
        H : 24
      'plankton8' :
        W : 24
        H : 23
      'plankton9' :
        W : 21
        H : 32
      'plankton10' :
        W : 30
        H : 36
      'plankton11' :
        W : 33
        H : 28
  
    NOISES  :
      'plankton1' : 1
      'plankton2' : 1
      'plankton3' : 1
    
    draw : ->
      ac = atom.context
      ac.save()
      properties = @GFX[@SPRITENAME]
      ac.translate(@x-(properties.W>>1), @y-(properties.H>>1))
      ac.rotate(@rotation)
      ac.drawImage(@SPRITE, 0, 0)
      ac.restore()
      
    move : ->
      if @y < 0 or @x < 0 or @eaten
        @move = null
      else
        @checkHits()
        @x += 2*@game.current
    
    checkHits : ->
      bin = @game.hash2d.get(@)
      (
        if entity? and @canHit(entity) and @hit(entity)
          atom.playSound($$.WR(@NOISES))
          entity.eat(@) if entity.eat?
          @eaten = true
          break
      ) for entity in bin
      return 
      
    canHit : (e) ->
      switch e.constructor.name
        when 'Fish'
          true
        else
          false
    
    # distance between
    hit : (e) ->
      dx = e.x - @x
      dy = e.y - @y
      
      dx*dx + dy*dy < @r2+e.r2
    
    constructor : (params) ->
      @[k] = v for k, v of params
      
      s = $$.R(1,11)
      @frame = $$.R(0,1)
      
      @SPRITENAME = "plankton#{s}"
      @SPRITE = atom.gfx["#{@SPRITENAME}n#{$$.R(1,2)}"]
      @r    = @GFX[@SPRITENAME].W
      @r_2  = @r>>1
      @r2   = @r*@r
      @rotation = $$.r(@PI2)
      