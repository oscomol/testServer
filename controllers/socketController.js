const socketController = (io) => {
      let users = [];
    
      io.on('connection', (socket) => {
        try {
          const isExist = users.find((user) => user === socket.id);
          if (!isExist) {
            users.push(socket.id);
          }
    
          socket.on('disconnect', () => {
            try {
              const remainingUsers = users.filter((user) => user !== socket.id);
              users = remainingUsers;
            } catch (error) {
              console.error('Error during disconnect:', error);
            }
          });
        } catch (error) {
          console.error('Error during connection:', error);
        }
      });
    };
    
    module.exports = socketController;
    