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
    icon        : 'icon.png'
    fledgeling0  : 'fledgeling0.png'
    fledgeling1  : 'fledgeling1.png'
    
    bubble0n1    : 'bubble0/1.png'
    bubble0n2    : 'bubble0/2.png'
    bubble0n3    : 'bubble0/3.png'
    bubble0n4    : 'bubble0/4.png'
    bubble0n5    : 'bubble0/5.png'
    bubble0n6    : 'bubble0/6.png'
    
    bubble1n1    : 'bubble1/1.png'
    bubble1n2    : 'bubble1/2.png'
    bubble1n3    : 'bubble1/3.png'
    bubble1n4    : 'bubble1/4.png'
    bubble1n5    : 'bubble1/5.png'
    bubble1n6    : 'bubble1/6.png'
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