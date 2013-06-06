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
    spriteX     : 0
    spriteY     : 0
    GFX :
      W : 16
      H : 16
      W_2 : 8
      H_2 : 8
      
    NOISES  :
      'plankton1' : 1
      'plankton2' : 1
      'plankton3' : 1
    
    draw : ->
      ac = atom.context
      ac.save()
      ac.globalAlpha = 0.3
      ac.translate(@x-8, @y-8)
      #ac.rotate(@rotation)
      ac.drawImage(atom.gfx.plankton, @spriteX<<4, @spriteY<<4, 16, 16, 0, 0, 16, 16)
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
      
      @spriteX = $$.R(0,11)
      @spriteY = $$.R(0,2)
      
      # todo: inline this once we have no more plankton types to add
      @r    = 8
      @r_2  = @r>>1
      @r2   = @r*@r
      @rotation = $$.r(@PI2)
      