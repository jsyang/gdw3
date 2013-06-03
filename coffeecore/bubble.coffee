define ->
  class Bubble
    x : 0
    y : 0
    
    hashable  : false
    
    SPRITENAME : null
    GFX :
      'bubble4' :
        W   : 4
        H   : 4
        W_2 : 2
        H_2 : 2
      'bubble6' :
        W   : 6
        H   : 6
        W_2 : 3
        H_2 : 3
      'bubble8' :
        W   : 8
        H   : 8
        W_2 : 4
        H_2 : 4
      'bubble12' :
        W   : 12
        H   : 12
        W_2 : 6
        H_2 : 6
      'bubble16' :
        W   : 16
        H   : 16
        W_2 : 8
        H_2 : 8
      'bubble24' :
        W   : 24
        H   : 24
        W_2 : 12
        H_2 : 12
      'bubble32' :
        W   : 32
        H   : 32
        W_2 : 16
        H_2 : 16
    
    dx        : 0
    lifetime  : 0
    
    draw : ->
      ac = atom.context
      ac.globalAlpha = 0.3
      sprite = atom.gfx[@SPRITENAME]
      ac.drawImage(sprite, @x-@GFX[@SPRITENAME].W_2, @y-@GFX[@SPRITENAME].W_2)
      ac.globalAlpha = 1
    
    remove : ->
      @move = null
      @game = null
    
    move : ->
      if @y < -@GFX[@SPRITENAME].H_2 or @x < -@GFX[@SPRITENAME].W_2
        @move = null
        @game = null
      else
        @y  += @dy
        @x  += 2*@game.current
      
    SIZES :
      '4' : 1
      '6' : 2
      '8' : 3
      '12' : 2
      '16' : 2
      '24' : 1
      '32' : 1
      
    constructor : (params) ->
      @[k] = v for k, v of params

      @SPRITENAME = "bubble#{$$.WR(@SIZES)}"
      
      @dy = -$$.r(4.9) - 0.15