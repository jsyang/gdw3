define [
  'core/aifish'
  'core/bubble'
  'core/hook'
], (AIFish, Bubble, Hook) ->
    
  class FishGame extends atom.Game
    
    cycles   : 0
    clearEntitiesInterval : 300 # how often do we try and clear out entities[]
    
    # flow of the water
    current  : -3
    
    player   : null
    entities : []
    
    
    constructor : ->
      makeFish = (point, chasePoint=false) =>
        fish = new AIFish({
          game  : @
          x     : point.x+$$.R(-120,120)
          y     : point.y+$$.R(-120,120)
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
      
      @player = new AIFish({
          game : @
          x : $$.R(-120,120)
          y : $$.R(-120,120)
          w : 24
          h : 20
          maxSpeed : 9
        })
      
      @entities.push(@player)
      
      @registerInputs()
      @registerFocus()
    
    registerInputs : ->
      atom.input.bind(atom.button.LEFT, 'mouseleft')
      atom.input.bind(atom.touch.TOUCHING, 'touchfinger')
    
    registerFocus : ->
      # make sure we don't waste them precious cycles.
      window.onblur = => @stop
      window.onfocus = => @run
    
    addHook : (p) ->
      @entities.push(new Hook({
        x     : p.x+$$.R(-32,32)
        y     : p.y+$$.R(-32,32)
        game  : @
      }))
    
    addBubble : (p) ->
      @entities.push(new Bubble({
        x     : p.x+$$.R(-64,64)
        y     : p.y+$$.R(-32,32)
        game  : @
      }))
      
    update : (dt) ->
      @mode[@mode.current].apply(@, [dt])
    
    mode :
      current : 'move'
      
      # Move the mouse around and make things follow you
      move : (dt) ->
        @updateEntities()
        @intervalAddBubbles()
        @intervalAddHooks()
      
        #if (atom.input.pressed('touchfinger') or atom.input.pressed('mouseleft'))
        #  @addHook(atom.input.mouse)
    
    intervalAddHooks : ->
      if (@cycles+15) % 75 is 0
        point =
          x : atom.width + $$.R(100, 200)
          y : $$.R(20,atom.height)
        @addHook(point) for i in [0...$$.R(2,4)]
      return
      
    intervalAddBubbles : ->
      if @cycles % 50 is 0
        point =
          x : atom.width + $$.R(100, 200)
          y : $$.R(100,atom.height)
        @addBubble(point) for i in [0...$$.R(3,6)]
      return
    
    updateEntities : ->
      if @cycles > @clearEntitiesInterval
        newEntities = []
        (
          if e.move?
            e.move()
            newEntities.push(e)
          else
            delete e.game
            
        ) for e in @entities
        @entities = newEntities
        @cycles = 0
        
      else
        (
          if e.move? then e.move()
        ) for e in @entities
        @cycles++
        
      return
      
    draw : ->
      atom.context.clear()
      (if e.move? then e.draw()) for e in @entities