define [
  'core/fish'
  'core/bubble'
  'core/hook'
  'core/hash2d'
  'core/plankton'
  'core/swarm'
  'core/rock'
], (Fish, Bubble, Hook, Hash2D, Plankton, Swarm, Rock) ->
    
  class FishGame extends atom.Game
    
    cycles                : 0
    cyclesPeriod          : 600
    clearEntitiesInterval : 300 # how often do we try and clear out entities[]
    
    # flow of the water
    current  : -1.9
    
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
    
    addRock : (p) ->
      @FG.queue.push(new Rock({
        x     : p.x+$$.R(-50,50)
        game  : @
      }))
    
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
      if @cycles % 210 is 0
        point =
          x : atom.width + $$.R(100, 200)
          y : $$.R(100,atom.height)
        @addBubble(point) for i in [0...$$.R(3,6)]
      return
    
    intervalAddRocks : ->
      if @cycles % 20 is 0
        point =
          x : atom.width + $$.R(100, 300)
        @addRock(point) for i in [0...$$.R(1,3)]
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
        @intervalAddRocks()
    
    BG :
      SURFACE :
        sprite : 'surface'
        x : 0
        w : 500
        h : -100
        rate : 0.18
      SEAFLOOR1 :
        sprite : 'seafloor1'
        x : 0
        w : 500
        h : 200
        rate : 0.58
      SEAFLOOR2 :
        sprite : 'seafloor2'
        x : 0
        w : 500
        h : 100
        rate : 0.97
    
    FG :
      queue : []
    
    drawSeaFloor : (sf) ->
      ac = atom.context
      
      (
        ac.drawImage(atom.gfx[sf.sprite], sf.x+500*i, if sf.h>0 then atom.height-sf.h else 0)
      ) for i in [-1..(atom.width*0.002)>>0]
      
      sf.x += sf.rate*@current
      if sf.x<0
        sf.x = 500
      return
      
    drawRocks : ->
      if @cycles % (@clearEntitiesInterval>>2) is 0
        newQueue = []
        (
          if e.move? and e.draw?
            e.move()
            e.draw()
            newQueue.push(e)
        ) for e in @FG.queue
        @FG.queue = newQueue
      else
        (
          if e.move? and e.draw?
            e.move()
            e.draw()
        ) for e in @FG.queue
      return
    
    draw : ->
      atom.context.clear()
      @drawSeaFloor(@BG.SURFACE)
      @drawSeaFloor(@BG.SEAFLOOR1)
      @drawSeaFloor(@BG.SEAFLOOR2)
      (if e.move? and e.draw? then e.draw()) for e in @entities
      @drawRocks()
      