define ->
  class Hook
    x : 0
    y : 0
    
    lifetime  : 0
    HOOKANGLE : 3.6185837
    
    draw : ->
      ac = atom.context
      
      ac.save()
      
      ac.lineWidth                = @r*0.25
      ac.strokeStyle              = '#111'
      
      ac.translate(@x,@y)
      
      ac.beginPath()
      ac.arc(0, 0, @r, 0, @HOOKANGLE);
      ac.stroke()
      
      ac.moveTo(@r, 0)
      ac.quadraticCurveTo(@r*0.3, -@r*1.6, @r*0.3, -2*@r)
      ac.stroke()
      
      ac.lineWidth                = 0.5
      ac.strokeStyle              = '#222'
      ac.moveTo(@r*0.3, -2*@r)
      ac.lineTo(@r*0.3, -@y)
      ac.stroke()
      
      ac.restore()
        
    move : ->
      if @y < -@r_2 or @x < -@r_2
        @move = null
      else
        #@y  += @dy
        @x  += 2*@game.current
        #@lifetime += 0.2
      
    constructor : (params) ->
      @[k] = v for k, v of params
      
      @r    = $$.R(1,8)
      @r_2  = @r>>1
  