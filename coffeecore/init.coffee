define [
  'core/util'
  'core/atom'
  'core/game'
  #'core/mobileFeatures'
], (_util, _atom, FishGame) ->
  
  startGame = ->
    window.game = new FishGame()
    window.game.run()
    
  
  loaded =
    gfx : false
    sfx : false
    
  isPreloadComplete = ->
    if loaded.gfx and loaded.sfx
      startGame()
      
      #if window.isMobile and window.orientation is 0
      #  window.onorientationchange()
        
      true
    else
      false
    
  atom.preloadImages({
    icon          : 'icon.png'
    fledgeling0   : 'fledgeling0.png'
    fledgeling1   : 'fledgeling1.png'
    
    bubble0n1     : 'bubble0/1.png'
    bubble0n2     : 'bubble0/2.png'
    bubble0n3     : 'bubble0/3.png'
    bubble0n4     : 'bubble0/4.png'
    bubble0n5     : 'bubble0/5.png'
    bubble0n6     : 'bubble0/6.png'
    
    bubble1n1     : 'bubble1/1.png'
    bubble1n2     : 'bubble1/2.png'
    bubble1n3     : 'bubble1/3.png'
    bubble1n4     : 'bubble1/4.png'
    bubble1n5     : 'bubble1/5.png'
    bubble1n6     : 'bubble1/6.png'
    
    plankton1n1    : 'plankton1/1.png'
    plankton1n2    : 'plankton1/2.png'
    plankton2n1    : 'plankton2/1.png'
    plankton2n2    : 'plankton2/2.png'
    plankton3n1    : 'plankton3/1.png'
    plankton3n2    : 'plankton3/2.png'
    plankton4n1    : 'plankton4/1.png'
    plankton4n2    : 'plankton4/2.png'
    plankton5n1    : 'plankton5/1.png'
    plankton5n2    : 'plankton5/2.png'
    plankton6n1    : 'plankton6/1.png'
    plankton6n2    : 'plankton6/2.png'
    plankton7n1    : 'plankton7/1.png'
    plankton7n2    : 'plankton7/2.png'
    plankton8n1    : 'plankton8/1.png'
    plankton8n2    : 'plankton8/2.png'
    plankton9n1    : 'plankton9/1.png'
    plankton9n2    : 'plankton9/2.png'
    plankton10n1    : 'plankton10/1.png'
    plankton10n2    : 'plankton10/2.png'
    plankton11n1    : 'plankton11/1.png'
    plankton11n2    : 'plankton11/2.png'
    
    
  }, ->
    loaded.gfx = true
    isPreloadComplete()
  )
  
  atom.preloadSounds({
    tick        : 'tick.mp3'
    
    plankton1   : 'plankton1.mp3'
    plankton2   : 'plankton2.mp3'
    plankton3   : 'plankton3.mp3'
    
    recruit     : 'recruit.mp3'
  }, ->
    loaded.sfx = true
    isPreloadComplete()
  )
  
  return