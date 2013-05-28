define ->
  class Bubble
    x : 0
    y : 0
    
    dx        : 0
    lifetime  : 0
    PI2       : 2*Math.PI
    
    draw : ->
      ac = atom.context
      ac.globalAlpha              = 0.5
      ac.fillStyle                = '#A2CBF5'
            
      ac.beginPath()
      ac.arc(@x-@r_2+@dx, @y-@r_2, @r, 0, @PI2)
      ac.closePath()
      ac.fill()
      
      ac.globalAlpha              = 1
      
    move : ->
      if @y < -@r_2 or @x < -@r_2
        @move = null
      else
        @y  += @dy
        @x  += 4*@game.current
        @dx = @dxAmplitude * Math.sin(@lifetime)
        @lifetime += 0.2
      
    constructor : (params) ->
      @[k] = v for k, v of params
    
      @r    = $$.R(1,5)+$$.r(5)
      @r_2  = @r>>1
  
      @dy = -$$.r(2.9) - 0.85
      @dxAmplitude = $$.r(3)+1