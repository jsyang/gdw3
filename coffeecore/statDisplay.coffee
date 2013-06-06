define ->
  class StatDisplay
    
    margin : 8
    
    constructor : (params) ->
      @[k] = v for k, v of params
    
    draw : ->
      ac = atom.context
      
      # Saturated fat molecule.
      y = atom.height-32-8
      ac.drawImage(atom.gfx.fatstart, @margin, y)
      i=1
      if (@game.player.fat>>0) > 0
        (
          ac.drawImage(atom.gfx.fatmiddle, @margin+24*i, y)
          i++
        ) for j in [0...(@game.player.fat>>0)]
      ac.drawImage(atom.gfx.fatend, @margin+24*i, y)
      
      # Metabolism display
      y -= 36
      ac.drawImage(atom.gfx.bolt24, @margin, y) unless @game.player.metabolism < 0.001
      #ac.font = '24px sans-serif'
      #ac.fillText(''+((@game.player.metabolism*@game.player.metabolismFactor_)>>0), @margin+28, y+20)
      #ac.fillText(@game.player.metabolism, @margin+28, y+20)
      
      # DNA collected
      y -= 36
      (
        ac.drawImage(atom.gfx.dna, @margin+28*j, y)
      ) for j in [0...@game.player.roe]
      
      
      
      return