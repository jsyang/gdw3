define ->
  class Roe
    x : 0
    y : 0
    
    hashable  : false
    
    SPRITENAME : null
    GFX :
      'roe1' :
        W   : 16
        H   : 16
        W_2 : 8
        H_2 : 8
        N   : 1
      'roe2' :
        W   : 24
        H   : 16
        W_2 : 12
        H_2 : 8
        N   : 2
      'roe3' :
        W   : 24
        H   : 24
        W_2 : 12
        H_2 : 12
        N   : 3
      
    draw : ->
      ac = atom.context
      sprite = atom.gfx[@SPRITENAME]
      ac.drawImage(sprite, @x-@GFX[@SPRITENAME].W_2, @y-@GFX[@SPRITENAME].H_2)
    
    remove : ->
      @move = null
      @game = null
    
    move : ->
      if @y < -@GFX[@SPRITENAME].H_2 or @x < -@GFX[@SPRITENAME].W_2
        @remove()
      else
        @x  += 2*@game.current
        @checkHits()
      return
    
    checkHits : ->
      bin = @game.hash2d.get(@)
      (
        if entity? and @canHit(entity) and @hit(entity) and entity.player
          entity.collectRoe(@GFX[@SPRITENAME].N) if entity.collectRoe?
          @remove()
          break
      ) for entity in bin
      return
      
    canHit : (e) ->
      switch e.constructor.name
        when 'Fish'
          if @player then false else true
        else
          false
    
    SIZES :
      '1' : 6
      '2' : 2
      '3' : 1
    
    hit : (e) ->
      dx = e.x - @x
      dy = e.y - @y
      
      dx*dx + dy*dy < @r2+e.r2
    
    constructor : (params) ->
      @[k] = v for k, v of params

      @SPRITENAME = "roe#{$$.WR(@SIZES)}"
      @r2         = @GFX[@SPRITENAME].W>>1
      @r2        *= @r2