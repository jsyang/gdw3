define ->
  class Hook
    x : 0
    y : 0
    
    caught    : false
    HOOKANGLE : 3.6185837
    
    draw : ->
      ac = atom.context
      
      ac.save()
      
      ac.lineWidth                = @r*0.25
      ac.strokeStyle              = if @caught then '#611' else '#111'
      
      ac.translate(@x,@y)
      
      ac.beginPath()
      ac.arc(0, 0, @r, 0, @HOOKANGLE);
      ac.stroke()
      
      ac.moveTo(@r, 0)
      ac.quadraticCurveTo(@r*0.3, -@r*1.6, @r*0.3, -2*@r)
      ac.stroke()
      
      ac.lineWidth                = 0.5
      ac.strokeStyle              = if @caught then '#622' else '#222'
      ac.moveTo(@r*0.3, -2*@r)
      ac.lineTo(@r*0.3, -@y)
      ac.stroke()
      
      ac.restore()
        
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
        when 'AIFish'
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
  