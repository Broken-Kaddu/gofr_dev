package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/davecgh/go-spew/spew"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

// Block structure defines the structure of a single block in the blockchain
type Block struct {
	Index             int    // Position of the block in the chain
	UserID            string // Unique identifier of the user
	Timestamp         string // Timestamp of block creation
	TransactionID     int    // ID of the transaction
	TransactionStatus string // Status of the transaction
	Hash              string // Hash of the block
	PrevHash          string // Hash of the previous block
}

// Blockchain is a slice of blocks acting as the ledger
var Blockchain []Block

// calculateHash computes a SHA256 hash for a block based on its data
func calculateHash(block Block) string {
	record := string(block.Index) + block.UserID + block.Timestamp + string(block.TransactionID) + block.TransactionStatus + block.PrevHash
	h := sha256.New()
	h.Write([]byte(record))
	hashed := h.Sum(nil)
	return hex.EncodeToString(hashed)
}

// generateBlock creates a new block using the previous block and new data
func generateBlock(oldBlock Block, userID string, transactionID int, transactionStatus string) (Block, error) {
	var newBlock Block
	t := time.Now()

	newBlock.Index = oldBlock.Index + 1
	newBlock.UserID = userID
	newBlock.Timestamp = t.String()
	newBlock.TransactionID = transactionID
	newBlock.TransactionStatus = transactionStatus
	newBlock.PrevHash = oldBlock.Hash
	newBlock.Hash = calculateHash(newBlock)

	return newBlock, nil
}

// isBlockValid verifies the integrity and validity of a new block
func isBlockValid(newBlock, oldBlock Block) bool {
	if oldBlock.Index+1 != newBlock.Index {
		return false
	}
	if oldBlock.Hash != newBlock.PrevHash {
		return false
	}
	if calculateHash(newBlock) != newBlock.Hash {
		return false
	}
	return true
}

// replaceChain replaces the current blockchain with a new one if it is longer
func replaceChain(newBlocks []Block) {
	if len(newBlocks) > len(Blockchain) {
		Blockchain = newBlocks
	}
}

// run initializes and starts the HTTP server with CORS support
func run() error {
	mux := makeMuxRouter()

	// Enhanced CORS setup
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:3000", "*"}, // Add Insomnia/Postman or any additional origins here. "*" allows all origins.
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"}, // Allow necessary HTTP methods
		AllowedHeaders:   []string{"Content-Type", "Authorization"}, // Allow specific headers
	})
	handler := c.Handler(mux)

	httpAddr := os.Getenv("ADDR")
	log.Println("Listening on ", os.Getenv("ADDR"))
	s := &http.Server{
		Addr:           ":" + httpAddr,
		Handler:        handler,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	if err := s.ListenAndServe(); err != nil {
		return err
	}

	return nil
}

// makeMuxRouter sets up the HTTP routes for the blockchain application
func makeMuxRouter() http.Handler {
	muxRouter := mux.NewRouter()
	muxRouter.HandleFunc("/blocks", handleGetBlockchain).Methods("GET") // Route to get the blockchain
	muxRouter.HandleFunc("/blocks", handleWriteBlock).Methods("POST")  // Route to add a new block
	muxRouter.HandleFunc("/blocks/{id}", handleGetBlockByID).Methods("GET") // Route to get a block by ID
	return muxRouter
}

// handleGetBlockchain handles GET requests to retrieve the blockchain
func handleGetBlockchain(w http.ResponseWriter, r *http.Request) {
	bytes, err := json.MarshalIndent(Blockchain, "", "  ")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	io.WriteString(w, string(bytes))
}

// handleGetBlockByID handles GET requests to retrieve a specific block by ID
func handleGetBlockByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	for _, block := range Blockchain {
		if string(block.Index) == id {
			bytes, err := json.MarshalIndent(block, "", "  ")
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			io.WriteString(w, string(bytes))
			return
		}
	}
	http.Error(w, "Block not found", http.StatusNotFound)
}

// Message structure for incoming data when creating a new block
type Message struct {
	UserID            string // User ID for the transaction
	TransactionID     int    // Transaction ID
	TransactionStatus string // Status of the transaction
}

// handleWriteBlock handles POST requests to add a new block to the blockchain
func handleWriteBlock(w http.ResponseWriter, r *http.Request) {
	var m Message

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&m); err != nil {
		respondWithJSON(w, r, http.StatusBadRequest, r.Body)
		return
	}
	defer r.Body.Close()

	newBlock, err := generateBlock(Blockchain[len(Blockchain)-1], m.UserID, m.TransactionID, m.TransactionStatus)
	if err != nil {
		respondWithJSON(w, r, http.StatusInternalServerError, m)
		return
	}
	if isBlockValid(newBlock, Blockchain[len(Blockchain)-1]) {
		newBlockchain := append(Blockchain, newBlock)
		replaceChain(newBlockchain)
		spew.Dump(Blockchain)
	}

	respondWithJSON(w, r, http.StatusCreated, newBlock)
}

// respondWithJSON sends a JSON response to the client
func respondWithJSON(w http.ResponseWriter, r *http.Request, code int, payload interface{}) {
	response, err := json.MarshalIndent(payload, "", "  ")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("HTTP 500: Internal Server Error"))
		return
	}
	w.WriteHeader(code)
	w.Write(response)
}

// main initializes the application and starts the server
func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}

	go func() {
		t := time.Now()
		genesisBlock := Block{0, "test", t.String(), 0, "Gas fee", "", ""}
		spew.Dump(genesisBlock)
		Blockchain = append(Blockchain, genesisBlock)
	}()
	log.Fatal(run())
}

// type Block struct {
// 	Index             int    // Position of the block in the chain
// 	UserID            string // Unique identifier of the user
// 	Timestamp         string // Timestamp of block creation
// 	TransactionID     int    // ID of the transaction
// 	TransactionStatus string // Status of the transaction
// 	Hash              string // Hash of the block
// 	PrevHash          string // Hash of the previous block
// }
