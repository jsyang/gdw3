define ->
  class StatDisplay
    
    margin : 8
    
    constructor : (params) ->
      @[k] = v for k, v of params
    
    draw : ->
      ac = atom.context
      y = atom.height-32-8
      ac.drawImage(atom.gfx.fatstart, @margin, y)
      
      i=1
      if (@game.player.fat>>0) > 0
        (
          ac.drawImage(atom.gfx.fatmiddle, @margin+24*i, y)
          i++
        ) for j in [0...(@game.player.fat>>0)]
      
      ac.drawImage(atom.gfx.fatend, @margin+24*i, y)
      
      y -= 56
      (
        ac.drawImage(atom.gfx.dna, @margin+28*j, y)
      ) for j in [0...@game.player.roe]
      
      return