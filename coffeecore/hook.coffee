define ->
  class Hook
    x : 0
    y : 0
    
    hashable  : true
    caught    : false
    HOOKANGLE : 3.6185837
    
    draw : ->
      ac = atom.context
      ac.beginPath()
      ac.lineWidth                = 0.5
      ac.strokeStyle              = if @caught then '#a44' else '#444'
      ac.moveTo(@x, @y)
      ac.lineTo(@x, 0)
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
    
    constructor : (params) ->
      @[k] = v for k, v of params
      
      @r    = $$.R(1,8)
      @r_2  = @r>>1
      
      @r2   = @r*@r
  