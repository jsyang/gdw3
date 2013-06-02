define ->
  class Plankton
    
    x   : 0
    y   : 0
    PI2 : Math.PI*2
    r   : 4
    
    eaten     : false
    hashable  : true
    
    NOISES  :
      'plankton1' : 1
      'plankton2' : 1
      'plankton3' : 1
    
    draw : ->
      ac = atom.context
      
      ac.strokeStyle = '#666'
      ac.fillStyle   = '#F5F36C'
      ac.beginPath()
      ac.arc(@x, @y, @r, 0, @PI2);
      ac.stroke()
      ac.fill()
      ac.closePath()
        
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
      
      @r    = $$.R(2,12)
      @r_2  = @r>>1
      
      @r2   = @r*@r
  