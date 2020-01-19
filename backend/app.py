from starlette.applications import Starlette
from starlette.responses import Response
from starlette.middleware.cors import CORSMiddleware
import uvicorn
from pathlib import Path
import torch
import os
import transformers
from starlette.responses import JSONResponse
import numpy as np
from KimCNN import KimCNN
from keras.models import load_model
from keras.preprocessing.sequence import pad_sequences
import pickle
from fastai.vision import load_learner, defaults, open_image
import json
from decimal import Decimal


origin = "localhost:4200"

app = Starlette(debug=True)
app.add_middleware(CORSMiddleware, allow_headers=["*"], allow_origins=[origin, "*"], allow_methods=['*'], allow_credentials=True)
defaults.device = torch.device('cpu')
path = Path.cwd()
nlp_model = torch.load('BERT.pth')
nlp_model_lstm = load_model('LSTM.pth')

model_class = transformers.BertModel
tokenizer_class = transformers.BertTokenizer
pretrained_weights = 'bert-base-uncased'  # Load pretrained model/tokenizer

with open('tokenizer.pickle', 'rb') as handle:
    tokenizer_lstm = pickle.load(handle)

tokenizer = tokenizer_class.from_pretrained(pretrained_weights)
bert_model = model_class.from_pretrained(pretrained_weights)

target_columns = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"]


def tokenize_single_text(text, max_seq):
    return [tokenizer.encode(text, add_special_tokens=True)[:max_seq]]


def pad_text(tokenized_text, max_seq):
    return np.array([el + [0] * (max_seq - len(el)) for el in tokenized_text])


def tokenize_and_pad_single_text(text, max_seq):
    tokenized_text = tokenize_single_text(text, max_seq)
    padded_text = pad_text(tokenized_text, max_seq)
    return torch.tensor(padded_text)


def targets_to_tensor(df, target_columns):
    return torch.tensor(df[target_columns].values, dtype=torch.float32)


@app.route('/predict/bert', methods=['POST'])
async def predict_bert(request):
    jsonE = await request.json()

    text = jsonE['text']
    indices = tokenize_and_pad_single_text(text, 100)
    y_preds = []
    with torch.no_grad():
        x = bert_model(indices)[0]

    y_pred = nlp_model(x)

    y_preds.extend(y_pred.cpu().detach().numpy().tolist())
    y_preds_np = np.array(y_preds)[0]

    map = {}

    i = 0

    for label in target_columns:
        map[label] = y_preds_np[i]
        i += 1
    
    return JSONResponse(map)

@app.route('/predict/lstm', methods=['POST'])
async def predict_lstm(request):
    jsonE = await request.json()

    text = jsonE['text']

    custom_test = tokenizer_lstm.texts_to_sequences([text])
    custom_test_ter = pad_sequences(custom_test, maxlen=100)
    prediction = nlp_model_lstm.predict(custom_test_ter)
    
    map = {}

    i = 0

    for label in target_columns:
        map[label] = prediction[0][i].item()
        i += 1
    
    return JSONResponse(map)


def _build_cors_prelight_response():
    response = Response()
    response.headers["Access-Control-Allow-Origin"] = origin
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['content-type'] = 'application/json'
    response.headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    return response


def _build_cors_actual_response(response):
    response.headers['Access-Control-Allow-Origin'] = origin
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    uvicorn.run(app, host='0.0.0.0', port=port)
