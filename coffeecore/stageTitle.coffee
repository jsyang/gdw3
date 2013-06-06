define ->
  class StageTitle

    hashable  : false
    
    SPRITENAME : null
    GFX :
      'spawninggrounds' :
        W   : 300
        H   : 100
        W_2 : 150
        H_2 : 50
        LIFETIME : 100
      'swimandeat' :
        W   : 200
        H   : 100
        W_2 : 100
        H_2 : 50
        LIFETIME : 100
      
    lifetime  : 0
    
    draw : ->
      ac = atom.context
      ac.drawImage(
        atom.gfx[@SPRITENAME],
        (atom.width>>1)-@GFX[@SPRITENAME].W_2,
        (atom.height>>1)-@GFX[@SPRITENAME].H_2
      )
      return
      
    remove : ->
      @move = null
      @game = null
    
    move : ->
      if @lifetime > 0
        @lifetime--
      else
        @remove()
      return
      
    constructor : (params) ->
      @[k] = v for k, v of params
      @lifetime = @GFX[@SPRITENAME].LIFETIME