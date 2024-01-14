;<Box
  sx={{
    height: isMobile || isTablet ? '500px' : '600px',
    overflow: 'scroll', // Set to 'auto' to enable scrolling
    '&::-webkit-scrollbar': {
      width: '0.4em',
    },
  }}
>
  <Grid
    justifyContent={isMobile ? 'flex-start' : 'center'}
    alignItems={'flex-start'}
  >
    <Grid item md={isMobile ? 12 : isTablet && 8}>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            spacing={2}
            direction={isMobile ? 'column' : 'row'}
            sx={{ my: 2 }}
          >
            <TextField label="Task name" fullWidth {...register('taskName')} />
            <TextField
              label="Original estimate"
              fullWidth
              type="number"
              {...register('originalEstimate')}
            />
          </Stack>
          <Stack spacing={2} direction={isMobile ? 'column' : 'row'}>
            <Controller
              name="statusId"
              control={control}
              render={({ field }) => {
                return (
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel
                      // sx={{
                      //   color: errors.categoryId ? 'error.main' : undefined,
                      //   '&.Mui-focused': {
                      //     color: errors.categoryId ? 'error.main' : undefined,
                      //   },
                      // }}
                      id="status"
                    >
                      Status type
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="status"
                      id="status"
                      fullWidth
                      label="Status type"
                      defaultValue={getValues('statusId')}
                      // error={!!errors.categoryId}
                    >
                      {getStatus?.map((item) => {
                        return (
                          <MenuItem key={item.statusId} value={item.statusId}>
                            {item.statusName}
                          </MenuItem>
                        )
                      })}
                    </Select>
                    {/* {errors.categoryId && (
                        <FormHelperText error>
                          {errors.categoryId.message}
                        </FormHelperText>
                      )} */}
                  </FormControl>
                )
              }}
            />
            <Controller
              name="priorityId"
              control={control}
              render={({ field }) => {
                return (
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel id="priority">Priority type</InputLabel>
                    <Select
                      {...field}
                      labelId="priority"
                      id="priority"
                      fullWidth
                      label="Priority type"
                      defaultValue={getValues('priorityId')}
                    >
                      {getPriority?.map((item) => {
                        return (
                          <MenuItem
                            key={item.priorityId}
                            value={item.priorityId}
                          >
                            {item.priority}
                          </MenuItem>
                        )
                      })}
                    </Select>
                    {/* {errors.categoryId && (
                        <FormHelperText error>
                          {errors.categoryId.message}
                        </FormHelperText>
                      )} */}
                  </FormControl>
                )
              }}
            />

            <Controller
              name="typeId"
              control={control}
              render={({ field }) => {
                return (
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel id="task">Task type</InputLabel>
                    <Select
                      {...field}
                      labelId="task"
                      id="task"
                      fullWidth
                      label="Task type"
                      defaultValue={getValues('typeId')}
                    >
                      {getTaskType?.map((item) => {
                        return (
                          <MenuItem key={item.id} value={item.id}>
                            {item.taskType}
                          </MenuItem>
                        )
                      })}
                    </Select>
                    {/* {errors.categoryId && (
                        <FormHelperText error>
                          {errors.categoryId.message}
                        </FormHelperText>
                      )} */}
                  </FormControl>
                )
              }}
            />
          </Stack>
          <Stack
            spacing={2}
            direction={isMobile ? 'column' : 'row'}
            sx={{ my: 2 }}
          >
            <Grid container alignItems={'center'}>
              <Grid item xs={12} md={6}>
                <FormControl sx={{ width: '100%', pr: 2 }}>
                  <InputLabel id="assignUserTask">Assigness</InputLabel>
                  <Select
                    labelId="assignUserTask"
                    id="assignUserTask"
                    fullWidth
                    multiple
                    value={selectedUsers || []}
                    onChange={handleChange}
                    input={<OutlinedInput label="Assigness" />}
                    renderValue={(selected) => {
                      const selectedUserNames = getAllProjectDetail?.members
                        ?.filter((user) => selected.includes(user.userId))
                        ?.map((user) => user.name)
                      return selectedUserNames.join(', ')
                    }}
                    MenuProps={MenuProps}
                  >
                    {getAllProjectDetail?.members?.map((user) => (
                      <MenuItem key={user.userId} value={user.userId}>
                        <Checkbox
                          checked={selectedUsers.includes(user.userId)}
                        />
                        {/* <Avatar src={user.avatar} sx={{ mr: 2 }} /> */}
                        <ListItemText primary={user.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <InputLabel id="time-tracking">Time tracking</InputLabel>
                  <Slider
                    aria-label="Time tracking"
                    value={timeTrackingSpent || 0}
                    sx={{ m: '0px 20px', width: 'calc(100% - 40px)' }}
                    onChange={(event, newValue) => {
                      setTimeTrackingSpent(newValue)
                      handleTimeTrackingSpentChange(newValue)
                    }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Time tracking spent"
                        type="number"
                        fullWidth
                        value={timeTrackingSpent}
                        onChange={(event) =>
                          handleTimeTrackingSpentChange(event.target.value)
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">h</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Time tracking remaining"
                        type="number"
                        fullWidth
                        value={timeTrackingRemaining}
                        onChange={(event) =>
                          setTimeTrackingRemaining(event.target.value)
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">h</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Stack>

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <ReactQuill
                {...field}
                theme="snow"
                className="quill-editor-container"
                placeholder="Write something awesome description..."
                value={quillValues}
                onChange={(value) => {
                  setQuillValues(value)
                  field.onChange(value)
                }}
              />
            )}
          />
          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={isMobile ? 2 : 2}
            sx={{ mt: 2 }}
            justifyContent={'flex-start'}
          >
            <LoadingButton
              variant="contained"
              size="large"
              type="submit"
              fullWidth
            >
              Create task
            </LoadingButton>
            <Button
              variant="contained"
              size="large"
              fullWidth
              color="error"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Stack>
        </form>
      </Box>
    </Grid>
  </Grid>
</Box>
