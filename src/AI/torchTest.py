import torch
import torch.nn as nn

X = torch.tensor([[1],[2],[3],[4]], dtype=torch.float32)
Y = torch.tensor([[3],[4],[5],[6]], dtype=torch.float32)

n_samples , n_features = X.shape
X_test = torch.tensor([5], dtype=torch.float32)

input_size = n_features
output_size = n_features

model = nn.Linear(input_size,output_size)

print(f'Prediction before training: f(5) = {model(X_test).item():.3f}')

learning_rate = 0.01
n_iters = 10000

loss = nn.MSELoss()
optimizer = torch.optim.SGD(model.parameters(), lr=learning_rate)

for epoch in range(n_iters):
    y_pred = model(X)
    
    l = loss(Y, y_pred)
    l.backward() # dl/dw

    optimizer.step()
    optimizer.zero_grad()

    if epoch % 10 == 0:
        [w, b] = model.parameters()
        #print(f'epoch {epoch+1}: w = {w[0][0].item():.3f}, loss = {l:.8f}')

print(f'Prediction after training: f(5) = {model(X_test).item():.3f}')