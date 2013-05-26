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
      makeFish = (point, chasePoint=false) ->
        fish = new AIFish({
          x : point.x+$$.R(-120,120)
          y : point.y+$$.R(-120,120)
        })
        
        if chasePoint is true
          fish.target = point
        fish
      
      p1 =
        x : $$.R(100,300)
        y : 50
      
      p2 =
        x : $$.R(100,300)
        y : 450
        
      p3 =
        x : $$.R(200,400)
        y : 200
        
      chaseMouse = (makeFish(p3) for i in [0...3])
      chasePoint1 = (makeFish(p1, true) for i in [0...3])
      chasePoint2 = (makeFish(p2, true) for i in [0...3])
      
      @entities = @entities.concat(chaseMouse, chasePoint1, chasePoint2)
      
    update : (dt) ->
      @mode[@mode.current].apply(@, [dt])
      @updateFish()
    
    updateFish : ->
      e.move() for e in @entities
    
    draw : ->
      atom.context.clear()
      e.draw() for e in @entities
    
    user :
      lastMouse :
        x : 0
        y : 0