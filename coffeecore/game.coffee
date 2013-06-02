define [
  'core/fish'
  'core/bubble'
  'core/hook'
  'core/hash2d'
  'core/plankton'
  'core/swarm'
], (Fish, Bubble, Hook, Hash2D, Plankton, Swarm) ->
    
  class FishGame extends atom.Game
    
    cycles                : 0
    cyclesPeriod          : 600
    clearEntitiesInterval : 300 # how often do we try and clear out entities[]
    
    # flow of the water
    current  : -1.6
    
    player   : null
    entities : []
    
    
    constructor : ->
      makeFish = (p) =>
        fish = new Fish({
          game    : @
          x       : p.x+$$.R(-120,120)
          y       : p.y+$$.R(-120,120)
          player  : true
        })
        
      p3 =
        x : $$.R(200,400)
        y : 200
        
      @entities = @entities.concat((makeFish(p3) for i in [0...3]))
      
      @hash2d_new = new Hash2D()
      @hash2d     = new Hash2D()
      
      @registerInputs()
      @registerFocus()
    
    registerInputs : ->
      atom.input.bind(atom.button.LEFT, 'mouseleft')
      atom.input.bind(atom.touch.TOUCHING, 'touchfinger')
    
    registerFocus : ->
      # make sure we don't waste them precious cycles.
      window.onblur = => @stop
      window.onfocus = => @run
    
    addPlankton : (p) ->
      @entities.push(new Plankton({
        x     : p.x+$$.R(-32,32)
        y     : p.y+$$.R(-32,32)
        game  : @
      }))
      
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
      
    addSwarm : (p) ->
      swarm = new Swarm({
        x     : p.x
        y     : p.y
        game  : @
      })
    
      swarmfish = (
        (
          new Fish({
            game    : @
            x       : p.x+$$.R(-64,64)
            y       : p.y+$$.R(-64,64)
            target  : swarm
          })
        ) for i in [0...$$.R(1,3)]
      )
      
      swarm.add(swarmfish)
      @entities.push(swarm)
      @entities = @entities.concat(swarmfish)
    
    intervalAddSwarm : ->
      # Swarms are rare.
      if (@cycles+13) % 270 is 0 and $$.r() < 0.3
        @addSwarm({
          x : atom.width + $$.R(100, 200)
          y : $$.R(20,atom.height-20)
        })
      return
    
    intervalAddPlankton : ->
      if (@cycles+7) % 120 is 0
        point =
          x : atom.width + $$.R(100, 200)
          y : $$.R(20,atom.height-20)
        @addPlankton(point) for i in [0...$$.R(2,8)]
      return
    
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
      @hash2d_new.reset()
      
      if @cycles > @clearEntitiesInterval
        @cycles = 0
        
      else
        @cycles++
      
      newEntities = []
      (
        if e.move?
          e.move()
          newEntities.push(e)
          if e.hashable
            @hash2d_new.add(e)

        else
          delete e.game
          
      ) for e in @entities
      @entities = newEntities
      
      # Switcheroo
      hash_old = @hash2d
      @hash2d = @hash2d_new
      @hash2d_new = hash_old
      
      return
      
    update : (dt) ->
      @mode[@mode.current].apply(@, [dt])
    
    mode :
      current : 'move'
      
      # Move the mouse around and make things follow you
      move : (dt) ->
        @updateEntities()
        @intervalAddBubbles()
        @intervalAddHooks()
        @intervalAddPlankton()
        @intervalAddSwarm()
      
    draw : ->
      atom.context.clear()
      (if e.move? and e.draw? then e.draw()) for e in @entities