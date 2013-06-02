define ->
  class Bubble
    x : 0
    y : 0
    
    hashable  : false
    
    SPRITENAME : null
    SPRITE : null
    GFX :
      'bubble0' :
        W : 31
        H : 27
        W_2 : 15
        H_2 : 13
      'bubble1' :
        W : 19
        H : 16
        W_2 : 9
        H_2 : 8
    
    dx        : 0
    lifetime  : 0
    
    draw : ->
      ac = atom.context
      ac.globalAlpha = 0.6
      ac.drawImage(@SPRITE, @x-@GFX[@SPRITENAME].W_2, @y-@GFX[@SPRITENAME].W_2)
      ac.globalAlpha = 1
      
    move : ->
      if @y < -@GFX[@SPRITENAME].H_2 or @x < -@GFX[@SPRITENAME].W_2
        @move = null
      else
        @y  += @dy
        @x  += 4*@game.current
        #@dx = @dxAmplitude * Math.sin(@lifetime)
        #@lifetime += 0.2
      
    constructor : (params) ->
      @[k] = v for k, v of params
      s = $$.R(0,1)
      n = $$.R(1,6)
      
      @SPRITE = atom.gfx["bubble#{s}n#{n}"]
      @SPRITENAME = "bubble#{s}"
      
      @dy = -$$.r(2.9) - 0.85
      #@dxAmplitude = $$.r(3)+1