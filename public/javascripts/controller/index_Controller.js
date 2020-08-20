app.controller('indexController', ['$scope', 'indexFactory', 'configFactory',($scope, indexFactory ,configFactory) => {


    $scope.messages = []
    $scope.players = {}

    function scroll (){
        setTimeout(() =>{
            const ql = document.querySelector('#chat-aria')
            ql.scrollTop = ql.scrollHeight
        })
    }
    // const socket = io.connect('http://localhost:3000')
    $scope.init = () => {
        const username = prompt('_Please check your name_')
        if (username) {
            InitSocket(username)
        }
        else {
            return false
        }
    }
    async function InitSocket(username){
        const connectionOptions = {
            reconnnectionAttempts: 3,
            reconnnectionDelay: 600,
        }
      
       const socketUrl = await configFactory.getConfig()

        
        indexFactory.connectSocket(socketUrl.data.socketUrl, connectionOptions)

            .then((socket) => {
                socket.emit('newuser', { username })

                socket.on('initPlayers', (players) => {
                    $scope.players = players
                    $scope.$apply()
                })

                socket.on('userData', (data) => {
                    const messageData = {
                        type: {
                            code: 0,
                            message: 1,
                        },
                        username: data.username,
                    }
                    $scope.messages.push(messageData)
                    $scope.players[data.id] = data
                    $scope.$apply();
                })

                socket.on('disUser', (user) => {
                    const messageData = {
                        type: {
                            code: 0,
                            message: 0,
                        },
                        username: user.username,
                    }
                    $scope.messages.push(messageData)
                    delete $scope.players[user.id]
                    
                    $scope.$apply();
                })

                socket.on('animate', data =>{
                    $('#' + data.socketID ).animate({ 'left': data.x, 'top': data.y }, () => {
                        animate = false
                    })
                })

                socket.on('newmessage', message =>{
                    $scope.messages.push(message)
                    $scope.$apply()
                })

                // $scope.onClickPlayer = ($event) => {
                //     $('#' + socket.id).animate({ 'left': $event.offsetX, 'top': $event.offsetY, })
                // }
                let animate = false
                $scope.onClickPlayer = ($event) => {
                    if (!animate) {
                        let x = $event.offsetX
                        let y = $event.offsetY

                        socket.emit('position', { x, y })


                        animate = true
                        $('#' + socket.id).animate({ 'left': x, 'top':y }, () => {
                            animate = false
                        })
                    }
                }
                $scope.newMessage = () => {
                    let message = $scope.message
                    const messageData = {
                        type: {
                            code: 1,
                        },
                        username: username,
                        text:  message
                    }
                    $scope.messages.push(messageData)
                    $scope.message = ''
                    scroll()
                    // $scope.$apply();

                    socket.emit('newMesssage',messageData)
                    console.log(messageData);
                  
                }
   
 
            })
            .catch((err) => {
                console.log(err);
            })
    }



}])