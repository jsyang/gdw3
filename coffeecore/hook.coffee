define ->
  class Hook
    x : 0
    y : 0
    
    hashable  : true
    caught    : false
    HOOKANGLE : 3.6185837
    
    draw : ->
      ac = atom.context
      sprite = atom.gfx[@SPRITENAME]
      ac.drawImage(sprite, @x-@GFX[@SPRITENAME].W_2, @y-@GFX[@SPRITENAME].H_2)
      ac.beginPath()
      ac.lineWidth                = 0.5
      ac.strokeStyle              = if @caught then '#a44' else '#444'
      ac.moveTo(@x+@GFX[@SPRITENAME].W_2-3, @y-@GFX[@SPRITENAME].H_2)
      ac.lineTo(@x+@GFX[@SPRITENAME].W_2-3, 0)
      ac.stroke()
        
    move : ->
      if @y < -@r_2 or @x < -@r_2
        @move = null
      else
        if @caught
          @y -= 3
        else
          @checkHits()
          
        @x += 2*@game.current
    
    checkHits : ->
      bin = @game.hash2d.get(@)
      (
        if entity? and @canHit(entity) and @hit(entity)
          atom.playSound('tick')
          entity.hooked(@) if entity.hooked?
          @caught = true
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
    
    SPRITENAME : null
    GFX :
      'hook160' :
        W   : 16
        H   : 16
        W_2 : 8
        H_2 : 8
      'hook161' :
        W   : 16
        H   : 16
        W_2 : 8
        H_2 : 8
      'hook160' :
        W   : 16
        H   : 16
        W_2 : 8
        H_2 : 8
      'hook24' :
        W   : 24
        H   : 24
        W_2 : 12
        H_2 : 12
      'hook32' :
        W   : 32
        H   : 32
        W_2 : 16
        H_2 : 16
    
    SIZES :
      '160' : 3
      '161' : 3
      '24'  : 2
      '32'  : 1 
    
    constructor : (params) ->
      @[k] = v for k, v of params
      @SPRITENAME = "hook#{$$.WR(@SIZES)}"
      
      @r    = $$.R(1,8)
      @r_2  = @r>>1
      
      @r2   = @r*@r
  