define ->
  class Rock
    GFX:
      ROCK1 :
        sprite : 'rock1'
        w : 100
        h : 200
      ROCK2 :
        sprite : 'rock2'
        w : 100
        h : 200
      ROCK3 :
        sprite : 'rock3'
        w : 100
        h : 200
      ROCK4 :
        sprite : 'rock4'
        w : 100
        h : 100
      ROCK5 :
        sprite : 'rock5'
        w : 100
        h : 100
      ROCK6 :
        sprite : 'rock6'
        w : 100
        h : 100
      ROCK7 :
        sprite : 'rock7'
        w : 100
        h : 100
      ROCK8 :
        sprite : 'rock8'
        w : 100
        h : 100
    
    SIZES :
      '1' : 1
      '2' : 1
      '3' : 1
      '4' : 3
      '5' : 3
      '6' : 5
      '7' : 2
      '8' : 4
    
    x : 0
    y : 0
    
    constructor : (params) ->
      @[k] = v for k, v of params
      @SPRITENAME = "ROCK#{$$.WR(@SIZES)}"
    
    draw : ->
      ac = atom.context
      r = @GFX[@SPRITENAME]
      ac.drawImage(atom.gfx[r.sprite], @x-(r.w>>1), atom.height-r.h)
      return
    
    remove : ->
      @move = null
      @game = null
      return
    
    move : ->
      if @x > -100
        @x += 3.1*@game.current
      else
        @remove()
      return
      