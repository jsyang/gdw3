define ->
  
  class Hash2D
    # _obj : null
    # w : null
    # h : null
    # _objLength : @w*@h
    
    _size : 6 # 1<<6
    
    reset : ->
      @_obj = ( [] for i in [0...@_objLength] )
      @
    
    add : (entity) ->
      if entity.x > @wPixels or entity.x < 0 or entity.y > @hPixels or entity.y < 0
      else
        @_obj[@w*(entity.y>>@_size)+(entity.x>>@_size)].push(entity)
      @
    
    get : (entity) ->
      if entity.x > @wPixels or entity.x < 0 or entity.y > @hPixels or entity.y < 0
        []
      else
        @_obj[@w*(entity.y>>@_size)+(entity.x>>@_size)]
    
    nullify : ->
      (
        (a[i] = null) for i in [0...a.length]
      ) for a in @_obj
      @
    
    constructor : (params) ->
      @[k] = v for k, v of params
      
      if !@w? or !@h?
        @w = atom.width   >>@_size
        @h = atom.height  >>@_size
        @wPixels = @w<<@_size
        @hPixels = @h<<@_size
        @w++
        @h++        
      else
        @wPixels = @w<<@_size
        @hPixels = @h<<@_size
      
      @_objLength = @w*@h
      
      @reset()