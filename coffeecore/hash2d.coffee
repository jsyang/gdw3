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
      if entity.x > atom.width or entity.x < 0 or entity.y > atom.height or entity.y < 0
      else
        @_obj[@w*(entity.y>>@_size)+(entity.x>>@_size)].push(entity)
      @
    
    get : (entity) ->
      if entity.x > atom.width or entity.x < 0 or entity.y > atom.height or entity.y < 0
        []
      else
        @_obj[@w*(entity.y>>@_size)+(entity.x>>@_size)]
    
    nullify : ->
      (
        (a = null) for i in [0...a.length]
      ) for a in @_obj
      @
    
    constructor : (params) ->
      if !params.w? or !params.h?
        @w = atom.width   >>@_size
        @h = atom.height  >>@_size
        @w++
        @h++
        @_objLength = @w*@h
        
      @[k] = v for k, v of params
      
      @reset()