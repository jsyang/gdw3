define ->

  class Swarm

    hashable  : false    
    x         : 0
    y         : 0
    dx        : 0
    dy        : 0
    children  : null # array of children
    
    move : ->
      if @x < -atom.width
        move = null
        @removeChildren()
        
      else
        @x += 2*@game.current + @dx
        @y += @dy
    
    removeChildren : ->
      (
        if c? and !c.player and !c.caught
          c.remove()
      ) for c in @children
    
    constructor : (params) ->
      @[k] = v for k, v of params
      @children = []
      
      # set random wandering
      @dx = -$$.R(2,7)*$$.r()
      #@dy = $$.r(0.4)-$$.r(0.4)
      
    add : (a) ->
      if !(a instanceof Array)
        a = [a]
      @children = @children.concat(a)