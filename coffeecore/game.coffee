define [
  'core/aifish'
], (AIFish) ->
    
  class FishGame extends atom.Game
    
    entities : []
    
    mode :
      current : 'move'
      
      # Move the mouse around and make things follow you
      move : (dt) ->
        
    
    constructor : ->
      makeFish = ->
        new AIFish({
          x : $$.R(50,300)
          y : $$.R(50,300)
        })
      
      @entities = (makeFish() for i in [0...11])
      
    update : (dt) ->
      @mode[@mode.current].apply(@, [dt])
      @updateFish()
    
    updateFish : ->
      e.chaseMouse() for e in @entities
    
    draw : ->
      atom.context.clear()
      e.draw() for e in @entities
    
    user :
      lastMouse :
        x : 0
        y : 0