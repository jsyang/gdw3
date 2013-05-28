define ->
  class Bubble
    x : 0
    y : 0
    
    dx        : 0
    lifetime  : 0
    PI2       : 2*Math.PI
    
    draw : ->
      ac = atom.context
      
      if false
        ac.drawImage(atom.gfx.bubble, @x-@w_2+@dx, @y-@h_2)
        
      else
        ac.save()
        #ac.globalCompositeOperation = 'xor'
        ac.globalAlpha              = 0.4
        ac.lineWidth                = 2
        #ac.strokeStyle              = '#555'
        ac.fillStyle                = '#A2CBF5'
        
        ac.beginPath()
        ac.arc(@x-@r_2+@dx, @y-@r_2, @r, 0, @PI2);
        ac.fill()
        
        ac.restore()
        
    move : ->
      if @y < -@r_2 or @x < -@r_2
        @move = null
      else
        @y  += @dy
        @x  += $$.r(1)+4*@game.current
        @dx = @dxAmplitude * Math.sin(@lifetime)
        @lifetime += 0.2
      
    constructor : (params) ->
      @[k] = v for k, v of params
      
      #image = atom.gfx.bubble
      #@w_2 = image.width>>1
      #@h_2 = image.height>>1
      
      @r    = $$.R(1,2)+$$.r(3)
      @r_2  = @r>>1
  
      @dy = -$$.r(2.9) - 0.85
      @dxAmplitude = $$.r(3)+1