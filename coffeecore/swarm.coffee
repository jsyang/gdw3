define ->

  class Swarm

    hashable  : false    
    x         : 0
    y         : 0
    children  : null # array of childre
    
    move : ->
      if @x < -40
        move = null
        @removeChildren()
        
      else
        @x  += 2*@game.current
    
    removeChildren : ->
      (
        if c? and !c.player
          c.remove()
      ) for c in @children
    
    constructor : (params) ->
      @[k] = v for k, v of params
      @children = []
      
    add : (a) ->
      if !(a instanceof Array)
        a = [a]
      @children = @children.concat(a)