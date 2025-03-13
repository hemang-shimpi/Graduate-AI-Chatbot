from flask import Flask, render_template, request, jsonify
from query_data import query_rag

app = Flask(__name__)

chat_history = []  # Store chat history

@app.route('/', methods=['GET', 'POST'])
def chat():
    global chat_history

    if request.method == 'POST':
        # Ensure the correct content-type is being sent
        data = request.get_json()

        if not data or 'query' not in data:
            return jsonify({"error": "Missing 'query' field"}), 400

        query_text = data['query']
        response = query_rag(query_text)

        # Append to the chat history
        chat_history.append({"user": query_text, "bot": response})

        return jsonify({"response": response, "chat_history": chat_history})

    return render_template('chat.html', chat_history=chat_history)


if __name__ == '__main__':
    app.run(debug=True)
