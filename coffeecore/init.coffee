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
    icon      : 'icon.png'
    fish      : 'fish.jpg'
  }, ->
    loaded.gfx = true
    isPreloadComplete()
  )
  
  atom.preloadSounds({
    crack       : 'crack.mp3'
  }, ->
    loaded.sfx = true
    isPreloadComplete()
  )
  
  return