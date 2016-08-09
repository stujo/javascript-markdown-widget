describe("GameModel", function() {
    var GameModel = require('../lib/GameModel');
    var gameModel;
    var startingState;

    beforeEach(function() {
        gameModel = new GameModel('0000202000000002');
        startingState = [0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2];
    });

    describe("#toString", function() {
        it("should return game state as string", function() {
            expect(gameModel.toString()).toEqual('0000202000000002');
        });
    });

    describe("#currentState", function() {
        it("should return game state", function() {
            expect(gameModel.currentState()).toEqual(startingState);
        });
    });

    describe("#currentDetails", function() {
        it("should include last move", function() {
            gameModel.left();
            expect(gameModel.currentDetails().move).toEqual('left');
        });
        it("should include board state", function() {
            expect(gameModel.currentDetails().board).toEqual(startingState);
        });
        it("should include finished state", function() {
            gameModel.right();
            expect(gameModel.currentDetails().finished).toEqual(false);
        });
        it("should include score", function() {
            expect(gameModel.currentDetails().score).toEqual(6);
        });
    });

    describe("#_getRowsFromState", function() {
        it("should return 4 rows", function() {
            expect(gameModel._getRowsFromState(startingState)).toEqual([
                [0, 0, 0, 0],
                [2, 0, 2, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 2]
            ]);
        });
    });

    describe("#_getColumnsFromState", function() {
        it("should return 4 columns", function() {
            expect(gameModel._getColumnsFromState(startingState)).toEqual([
                [0, 2, 0, 0],
                [0, 0, 0, 0],
                [0, 2, 0, 0],
                [0, 0, 0, 2]
            ]);
        });
    });



    describe("#_consolidateSet", function() {
        it("should return blank row", function() {
            expect(gameModel._consolidateSet([0, 0, 0, 0])).toEqual([0, 0, 0, 0]);
        });

        it("should move zeros to end", function() {
            expect(gameModel._consolidateSet([2, 0, 0, 4])).toEqual([2, 4, 0, 0]);
        });

        it("should combine twos to a four", function() {
            expect(gameModel._consolidateSet([2, 0, 2, 0])).toEqual([4, 0, 0, 0]);
        });

        it("should not combine 2420", function() {
            expect(gameModel._consolidateSet([2, 4, 2, 0])).toEqual([2, 4, 2, 0]);
        });

        it("should combine 8008", function() {
            expect(gameModel._consolidateSet([8, 0, 0, 8])).toEqual([16, 0, 0, 0]);
        });

        it("should combine 8008", function() {
            expect(gameModel._consolidateSet([8,8,16,32])).toEqual([16,16,32,0]);
        });

    });

    describe("#_columnsToState", function() {
        it("join columns", function() {
            expect(gameModel._columnsToState([
                [2, 0, 0, 4],
                [2, 0, 0, 0],
                [0, 4, 0, 0],
                [0, 0, 0, 2]
            ])).toEqual([2, 2, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 2]);
        });
    });

    describe("#_rowsToState", function() {
        it("join rows", function() {
            expect(gameModel._rowsToState([
                [2, 0, 0, 4],
                [2, 0, 0, 0],
                [0, 4, 0, 0],
                [0, 0, 0, 2]
            ])).toEqual([2, 0, 0, 4, 2, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 2]);
        });
    });


    describe("#_left_impl", function() {
        it("should combine the 4s to the left", function() {
            expect(gameModel._left_impl(startingState)).toEqual([
                0, 0, 0, 0,
                4, 0, 0, 0,
                0, 0, 0, 0,
                2, 0, 0, 0
            ]);
        });
    });

    describe("#_right_impl", function() {
        it("should combine the 4's to the right", function() {
            expect(gameModel._right_impl(startingState)).toEqual([
                0, 0, 0, 0,
                0, 0, 0, 4,
                0, 0, 0, 0,
                0, 0, 0, 2
            ]);
        });

        it("should combine the 4's to the right", function() {
            expect(gameModel._right_impl( [32,16,8,8, 8,4,0,0, 4,0,0,0, 0,0,0,0])).toEqual([
                0, 32, 16, 16,
                0, 0, 8, 4,
                0, 0, 0, 4,
                0, 0, 0, 0
            ]);
        });

       
    });

    describe("#_up_impl", function() {
        it("should move 2's to top row", function() {
            expect(gameModel._up_impl(startingState)).toEqual([
                2, 0, 2, 2,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0
            ]);
        });
    });
    describe("#_down_impl", function() {
        it("should move 2's to top row", function() {
            expect(gameModel._down_impl(startingState)).toEqual([
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                2, 0, 2, 2
            ]);
        });
    });

    describe('#_boardsEqual', function(){
        it("should return true", function() {
            expect(gameModel._boardsEqual(startingState, startingState.slice(0))).toEqual(true);
        });
        it("should return false", function() {
            var altered = startingState.slice(0);
            altered[altered.length - 1] = altered[altered.length - 1] + 1;
            expect(gameModel._boardsEqual(startingState, altered)).toEqual(false);
        });
    });

    describe("#_finished", function() {
       it("should detect jammed board", function(){
          expect(gameModel._finished([2,16,2,4,32,8,32,16,4,64,16,4,2,8,4,2])).toEqual(true)
       })
      it("should detect playable board", function(){
          expect(gameModel._finished([2,16,2,4,32,8,32,16,4,64,16,4,2,8,2,2])).toEqual(false)
       })
    });

    describe("#_spawnLocation ", function() {
        it("should only pick empty locations", function() {
            expect(gameModel._spawnLocation([6,7,80])).toBeAnyOf([
                80,7,6
            ]);
        });
    });


});
