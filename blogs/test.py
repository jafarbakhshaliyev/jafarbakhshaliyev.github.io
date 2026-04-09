from mpi4py import MPI
import logging
import numpy as np
from datetime import datetime
logging.basicConfig(format = '%(asctime)s: %(name)s %(message)s')
comm = MPI.COMM_WORLD
logger = logging.getLogger(str(comm.Get_rank()))
logger.warning(f"MPI: rank {comm.Get_rank()} / {comm.Get_size()}")
my_rank = comm.Get_rank()
size = comm.Get_size()
my_list = list(range(10000))
np.random.shuffle(my_list)
sub_array = np.array_split(my_list, size)
sub_array = comm.scatter(sub_array, root=0)
sorted_arr = sorted(sub_array)
sorted_array = comm.gather(sorted_arr, root = 0)
if my_rank == 0:
    final_result = []
    while len(final_result) < len(my_list):
        min_num = np.inf
        index_min = None
        for i in range(size):
            if len(sorted_array[i]) > 0 and sorted_array[i][0] < min_num:
                min_num = sorted_array[i][0]
                index_min = i
        if index_min is not None:
            final_result.append(min_num)
            sorted_array[index_min] = sorted_array[index_min][1:]
    print('Sorted list:', final_result)